'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { PLANS } from '@/lib/plans'

export default function NewCampaignPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [offer, setOffer] = useState('')
  const [audience, setAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [templates, setTemplates] = useState<any[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    const loadTemplates = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTemplates(data ?? [])
    }
    loadTemplates()
  }, [])

  const handleUseTemplate = (template: any) => {
    setOffer(template.offer)
    setAudience(template.target_audience ?? '')
    setShowTemplates(false)
  }

  const handleCreate = async () => {
    if (!name.trim() || !offer.trim()) {
      setError('Campaign name and offer are required.')
      return
    }

    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profileData } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const plan = PLANS[profileData?.plan as keyof typeof PLANS] ?? PLANS.free

    if (plan.max_campaigns !== Infinity) {
      const { count } = await supabase
        .from('campaigns')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      if ((count ?? 0) >= plan.max_campaigns) {
        setError('Campaign limit reached. Upgrade to Growth for unlimited campaigns.')
        setLoading(false)
        return
      }
    }

    const { data: campaign, error: insertError } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        name: name.trim(),
        offer: offer.trim(),
        target_audience: audience.trim()
      })
      .select()
      .single()

    if (insertError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push(`/campaigns/${campaign.id}`)
  }

  return (
    <div className="max-w-xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in your campaign details to get started</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">

        {templates.length > 0 && (
          <div>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-700"
            >
              {showTemplates ? 'Hide templates' : 'Load from template'}
            </button>

            {showTemplates && (
              <div className="mt-3 border border-gray-200 rounded-xl divide-y divide-gray-100">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUseTemplate(t)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{t.offer}</p>
                    </div>
                    <p className="text-xs text-gray-400 ml-4 flex-shrink-0">Use →</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. SaaS founders outreach — April"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer</label>
          <textarea
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="e.g. We help B2B SaaS companies book 10+ demos per month using cold email outreach"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">Be specific. This is what the email will sell.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. B2B SaaS founders, Series A, US-based"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-black text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-900 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
