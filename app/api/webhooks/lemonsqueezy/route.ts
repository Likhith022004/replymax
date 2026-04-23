import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VARIANT_TO_PLAN: Record<string, string> = {
  [process.env.LEMONSQUEEZY_STARTER_VARIANT_ID!]: 'starter',
  [process.env.LEMONSQUEEZY_GROWTH_VARIANT_ID!]: 'growth',
  [process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID!]: 'agency',
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 })
    }

    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    hmac.update(rawBody)
    const digest = hmac.digest('hex')

    if (digest !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const eventName = payload.meta?.event_name
    const attributes = payload.data?.attributes
    const userEmail = attributes?.user_email
    const variantId = String(attributes?.variant_id)
    const subscriptionId = String(payload.data?.id)
    const customerId = String(attributes?.customer_id)
    const plan = VARIANT_TO_PLAN[variantId]

    console.log('Webhook received:', eventName, userEmail, plan)

    if (!userEmail) {
      return NextResponse.json({ error: 'No email in payload' }, { status: 400 })
    }

    if (
      eventName === 'subscription_created' ||
      eventName === 'subscription_updated'
    ) {
      const { error } = await supabase
        .from('profiles')
        .update({
          plan: plan ?? 'free',
          lemon_squeezy_subscription_id: subscriptionId,
          lemon_squeezy_customer_id: customerId
        })
        .eq('email', userEmail)

      if (error) {
        console.error('Supabase update error:', error)
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
      }
    }

    if (
      eventName === 'subscription_cancelled' ||
      eventName === 'subscription_expired'
    ) {
      await supabase
        .from('profiles')
        .update({ plan: 'free' })
        .eq('email', userEmail)
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
