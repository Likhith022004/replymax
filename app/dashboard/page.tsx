'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { PLANS } from '@/lib/plans'
import UsageBar from '@/components/usage-bar'
import { DashboardSkeleton } from '@/components/skeleton'

export default function DashboardPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: campaignData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setProfile(profileData)
      setCampaigns(campaignData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <DashboardSkeleton />

  const plan = PLANS[profile?.plan as keyof typeof PLANS] ?? PLANS.free
  const usagePercent = Math.min((profile?.usage_count / plan.emails_per_month) * 100, 100)
  const isAtCampaignLimit = plan.max_campaigns !== Infinity && campaigns.length >= plan.max_campaigns

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back</p>
        </div>
        {isAtCampaignLimit ? (
          <div className="text-right">
            <p className="text-sm text-red-600 mb-2">Campaign limit reached on {plan.label} plan</p>
            <Link
              href="/pricing"
              className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Upgrade to Growth
            </Link>
          </div>
        ) : (
          <Link
            href="/campaigns/new"
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            New Campaign
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 animate-fade-in stagger-1 card-hover">
          <p className="text-sm text-gray-500 mb-1">Current Plan</p>
          <p className="text-xl font-semibold text-gray-900 capitalize">{profile?.plan ?? 'free'}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 animate-fade-in stagger-2 card-hover">
          <p className="text-sm text-gray-500 mb-1">Emails Used</p>
          <p className="text-xl font-semibold text-gray-900">{profile?.usage_count ?? 0} / {plan.emails_per_month}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 animate-fade-in stagger-3 card-hover">
          <p className="text-sm text-gray-500 mb-1">Campaigns</p>
          <p className="text-xl font-semibold text-gray-900">{campaigns.length}</p>
        </div>
      </div>

      <div className="mb-8 animate-fade-in stagger-4">
        <UsageBar plan={profile?.plan ?? 'free'} usageCount={profile?.usage_count ?? 0} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Campaigns</h2>
          <Link href="/campaigns" className="text-sm text-gray-500 hover:text-gray-900">View all</Link>
        </div>
        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-4">No campaigns yet</p>
            <Link
              href="/campaigns/new"
              className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Create your first campaign
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {campaigns.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
                <Link
                  href={`/campaigns/${c.id}`}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Open →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
