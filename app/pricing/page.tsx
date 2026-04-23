'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    emails: 300,
    campaigns: '1 campaign',
    features: ['300 emails/month', '1 active campaign', 'CSV upload', 'Copy + download'],
    cta: 'Get Starter',
    highlighted: false
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 149,
    emails: 1500,
    campaigns: 'Unlimited campaigns',
    features: ['1,500 emails/month', 'Unlimited campaigns', 'Templates + duplication', 'Priority processing'],
    cta: 'Get Growth',
    highlighted: true
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 299,
    emails: 7000,
    campaigns: 'Unlimited campaigns',
    features: ['7,000 emails/month', 'Unlimited campaigns', '3–5 team seats', 'Full workflow access'],
    cta: 'Get Agency',
    highlighted: false
  }
]

export default function PricingPage() {
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      setCurrentPlan(profile?.plan ?? 'free')
      setLoading(false)
    }
    load()
  }, [])

  const getCheckoutUrl = (planId: string) => {
    const urls: Record<string, string> = {
      starter: process.env.NEXT_PUBLIC_LS_STARTER_URL ?? '#',
      growth: process.env.NEXT_PUBLIC_LS_GROWTH_URL ?? '#',
      agency: process.env.NEXT_PUBLIC_LS_AGENCY_URL ?? '#'
    }
    const base = urls[planId]
    if (!base || base === '#') return '#'
    return `${base}?checkout[email]=${encodeURIComponent(userEmail)}`
  }

  if (loading) return <div className="text-gray-500 text-sm p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Simple pricing</h1>
        <p className="text-gray-500 mt-2">Pay for what you use. Upgrade when you need more.</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl p-6 border ${
                plan.highlighted ? 'border-black ring-1 ring-black' : 'border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <p className="text-xs font-medium text-white bg-black px-2 py-0.5 rounded-md inline-block mb-3">
                  Most popular
                </p>
              )}
              <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full text-center text-sm text-gray-400 border border-gray-200 rounded-lg py-2">
                  Current plan
                </div>
              ) : (
                <a
                  href={getCheckoutUrl(plan.id)}
                  className={`block w-full text-center text-sm px-4 py-2 rounded-lg ${
                    plan.highlighted
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {plan.cta}
                </a>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Payments processed securely by Lemon Squeezy. Cancel anytime.
      </p>
    </div>
  )
}
