'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { PLANS } from '@/lib/plans'

export default function CampaignsPage() {
  const supabase = createClient()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: profileData }, { data: campaignData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ])

      if (!campaignData) {
        setLoading(false)
        return
      }

      const campaignsWithCounts = await Promise.all(
        campaignData.map(async (c) => {
          const { count } = await supabase
            .from('generations')
            .select('id', { count: 'exact' })
            .eq('campaign_id', c.id)
          return { ...c, email_count: count ?? 0 }
        })
      )

      setProfile(profileData)
      setCampaigns(campaignsWithCounts)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>

  const plan = PLANS[profile?.plan as keyof typeof PLANS] ?? PLANS.free
  const isAtLimit = plan.max_campaigns !== Infinity && campaigns.length >= plan.max_campaigns

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">{campaigns.length} total</p>
        </div>
        {isAtLimit ? (
          <div className="text-right">
            <p className="text-sm text-red-600 mb-2">1 campaign limit on {plan.label} plan</p>
            <Link href="/pricing" className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800">
              Upgrade to Growth
            </Link>
          </div>
        ) : (
          <Link href="/campaigns/new" className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800">
            New Campaign
          </Link>
        )}
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">No campaigns yet</p>
          <Link href="/campaigns/new" className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800">
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {campaigns.map((c) => (
            <div key={c.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.offer}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-gray-300">{new Date(c.created_at).toLocaleDateString()}</p>
                  {c.email_count > 0 && (
                    <p className="text-xs text-gray-400">{c.email_count} emails generated</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/campaigns/${c.id}/duplicate`}
                  className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg"
                >
                  Duplicate
                </Link>
                <Link
                  href={`/campaigns/${c.id}`}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Open →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
