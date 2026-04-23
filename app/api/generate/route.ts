import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { checkUsage, incrementUsage } from '@/lib/usage'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SYSTEM_PROMPT = `You are a cold email copywriter. Your job is to write emails that feel like they came from a human who did real research, not an AI that read a homepage.

INTERNAL PROCESS (never output this):
1. Look at the company and website. Find ONE of these specific signals:
   - Are they hiring? (means scaling pain)
   - Are they a new company under 3 years old? (means establishing credibility)
   - Are they an agency? (means client retention or differentiation pain)
   - Are they a SaaS tool? (means activation or churn pain)
   - Are they ecommerce? (means CAC or repeat purchase pain)
   - Do they serve enterprise? (means long sales cycles or compliance pain)
2. Pick the single most likely pain based on that signal
3. Write a first line about THEIR SITUATION, not their achievements or company size

OUTPUT FORMAT (plain text only, zero markdown):
First line: [their situation or challenge in one sentence, under 18 words, no company name]
Email: [the first line as opening sentence. One sentence on why this matters now. One sentence on what you do and the outcome you deliver. One short question to open conversation. Total under 85 words.]

HARD RULES:
- Zero markdown, zero asterisks, zero bold
- Never mention company size or user numbers as the first line
- Never start with Managing, Building, Running, Scaling, Growing
- Never use: I noticed, I came across, I hope, Congrats on, Impressive
- The first line must describe a problem or tension, not an achievement
- CTA is one question only, under 15 words`

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { leads, campaign_id, offer } = await req.json()

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'No leads provided' }, { status: 400 })
    }

    if (!campaign_id || !offer) {
      return NextResponse.json({ error: 'Missing campaign_id or offer' }, { status: 400 })
    }

    const usageCheck = await checkUsage(user.id, leads.length)
    if (!usageCheck.allowed) {
      return NextResponse.json({ error: usageCheck.reason }, { status: 403 })
    }

    const results = []
    let successCount = 0

    for (const lead of leads) {
      try {
        const userPrompt = `Name: ${lead.name || 'Unknown'}
Company: ${lead.company || 'Unknown'}
Website: ${lead.website || 'not provided'}
Offer: ${offer}`

        const response = await fetch('https://api.aicredits.in/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.AICREDITS_API_KEY!}`
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ]
          })
        })

        const aiData = await response.json()

        if (!response.ok || !aiData.choices?.[0]?.message?.content) {
          console.error('AICredits error:', JSON.stringify(aiData))
          results.push({ lead, first_line: '', email: 'Generation failed for this lead.', error: true })
          continue
        }

        const output = aiData.choices[0].message.content
        // Normalize output first
        const normalized = output.replace(/\*\*/g, '').trim()

        // Try to parse structured output
        const firstLineMatch = normalized.match(/First line:\s*([^\n]+)/i)
        const emailMatch = normalized.match(/Email:\s*([\s\S]+)/i)

        let firstLine = firstLineMatch?.[1]?.trim() ?? ''
        let email = emailMatch?.[1]?.trim() ?? ''

        // If parsing failed, treat entire output as email and extract first sentence as first line
        if (!firstLine && !email) {
          email = normalized
          firstLine = normalized.split('.')[0]?.trim() ?? ''
        }

        // If we have email but no first line, extract first sentence
        if (!firstLine && email) {
          firstLine = email.split('.')[0]?.trim() ?? ''
        }

        // If we have first line but no email, use full output as email
        if (firstLine && !email) {
          email = normalized.replace(/First line:\s*[^\n]+\n?/i, '').trim()
        }

        // Strip any leaked labels
        email = email.replace(/^First line:\s*/i, '').trim()
        email = email.replace(/^Email:\s*/i, '').trim()
        firstLine = firstLine.replace(/^First line:\s*/i, '').trim()

        const { data: leadRecord, error: leadError } = await supabaseAdmin
          .from('leads')
          .insert({
            campaign_id,
            name: lead.name ?? '',
            company: lead.company ?? '',
            website: lead.website ?? ''
          })
          .select()
          .single()

        if (leadError || !leadRecord) {
          results.push({ lead, first_line: firstLine, email, error: true })
          continue
        }

        await supabaseAdmin.from('generations').insert({
          lead_id: leadRecord.id,
          campaign_id,
          first_line: firstLine,
          email: email,
          model_used: 'claude-sonnet-4'
        })

        results.push({ lead, first_line: firstLine, email })
        successCount++

      } catch {
        results.push({ lead, first_line: '', email: 'Generation failed for this lead.', error: true })
      }
    }

    if (successCount > 0) {
      await incrementUsage(user.id, successCount)
    }

    return NextResponse.json({ results })

  } catch (err) {
    console.error('Generation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
