import { createClient } from '@supabase/supabase-js'
import { PLANS } from './plans'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function checkUsage(userId: string, emailsRequested: number) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, usage_count, usage_reset_at')
    .eq('id', userId)
    .single()

  if (!profile) return { allowed: false, reason: 'Profile not found' }

  const plan = PLANS[profile.plan as keyof typeof PLANS] ?? PLANS.free

  // Reset usage if new month
  const resetDate = new Date(profile.usage_reset_at)
  const now = new Date()
  if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
    await supabase
      .from('profiles')
      .update({ usage_count: 0, usage_reset_at: now.toISOString() })
      .eq('id', userId)
    profile.usage_count = 0
  }

  const remaining = plan.emails_per_month - profile.usage_count

  if (emailsRequested > remaining) {
    return {
      allowed: false,
      reason: `You have ${remaining} emails left this month. Upgrade your plan to generate more.`
    }
  }

  return { allowed: true, remaining }
}

export async function incrementUsage(userId: string, count: number) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('usage_count')
    .eq('id', userId)
    .single()

  if (!profile) return

  await supabase
    .from('profiles')
    .update({ usage_count: (profile.usage_count ?? 0) + count })
    .eq('id', userId)
}
