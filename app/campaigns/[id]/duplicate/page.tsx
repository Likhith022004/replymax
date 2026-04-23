'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { PLANS } from '@/lib/plans'

export default function DuplicateCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()
  const router = useRouter()
  const [original, setOriginal] = useState<any>(null)
  const [name, setName] = useState('')
  const [offer, setOffer] = useState('')
  const [audience, setAudience] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

      if (!data) {
        router.push('/campaigns')
        return
      }

      setOriginal(data)
      setName(`${data.name} (copy)`)
      setOffer(data.offer)
      setAudience(data.target_audience ?? '')
      setLoading(false)
    }
    load()
  }, [id])

  const handleDuplicate = async () => {
    if (!name.trim() || !offer.trim()) {
      setError('Campaign name and offer are required.')
      return
    }

    setSaving(true)
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
        setSaving(false)
        return
      }
    }

    const { data: newCampaign, error: insertError } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        name: name.trim(),
        offer: offer.trim(),
        target_audience: audience.trim()
      })
      .select()
      .single()

    if (insertError || !newCampaign) {
      setError('Something went wrong. Please try again.')
      setSaving(false)
      return
    }

    router.push(`/campaigns/${newCampaign.id}`)
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>

  return (
    <div className="max-w-xl animate-fade-in">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Duplicating: {original?.name}</p>
        <h1 className="text-2xl font-bold text-gray-900">New Campaign from Template</h1>
        <p className="text-gray-500 text-sm mt-1">Same structure, new leads</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer</label>
          <textarea
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">Edit if your offer has changed.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleDuplicate}
            disabled={saving}
            className="bg-black text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Duplicate'}
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
