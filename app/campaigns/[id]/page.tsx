'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import LeadUpload from '@/components/lead-upload'
import ResultsTable from '@/components/results-table'
import UsageBar from '@/components/usage-bar'

interface Lead {
  name: string
  company: string
  website: string
}

interface Result {
  lead: Lead
  first_line: string
  email: string
}

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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

      setCampaign(data)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan, usage_count')
        .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
        .single()
      setProfile(profileData)

      const { data: existingGenerations } = await supabase
        .from('generations')
        .select('*, leads(*)')
        .eq('campaign_id', id)
        .order('created_at', { ascending: true })

      if (existingGenerations && existingGenerations.length > 0) {
        const mapped = existingGenerations.map((g: any) => ({
          lead: {
            name: g.leads?.name ?? '',
            company: g.leads?.company ?? '',
            website: g.leads?.website ?? ''
          },
          first_line: g.first_line,
          email: g.email
        }))
        setResults(mapped)
      }

      setLoading(false)
    }
    load()
  }, [id])

  const handleGenerate = async () => {
    if (leads.length === 0) {
      setError('Please upload a CSV first.')
      return
    }

    setGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads,
          campaign_id: id,
          offer: campaign.offer
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Generation failed. Please try again.')
        setGenerating(false)
        return
      }

      setResults(data.results)
      setLeads([])
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setGenerating(false)
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>
  if (!campaign) return null

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Campaign</p>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{campaign.offer}</p>
        </div>
      </div>

      {profile && (
        <div className="mb-6">
          <UsageBar plan={profile.plan} usageCount={profile.usage_count} />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Upload Leads</h2>
        <LeadUpload onLeadsReady={setLeads} />

        {leads.length > 0 && (
          <div className="mt-5">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-black text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {generating ? 'Generating... (this may take a minute)' : `Generate ${leads.length} emails`}
            </button>
            <p className="text-xs text-gray-400 mt-2">This will use {leads.length} of your monthly email credits.</p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <ResultsTable results={results} campaignName={campaign.name} />
        </div>
      )}

      {error && results.length === 0 && leads.length === 0 && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  )
}
