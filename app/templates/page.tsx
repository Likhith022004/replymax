'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { ListSkeleton } from '@/components/skeleton'

export default function TemplatesPage() {
  const supabase = createClient()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [offer, setOffer] = useState('')
  const [audience, setAudience] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setTemplates(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!name.trim() || !offer.trim()) {
      setError('Template name and offer are required.')
      return
    }

    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: insertError } = await supabase
      .from('templates')
      .insert({
        user_id: user.id,
        name: name.trim(),
        offer: offer.trim(),
        target_audience: audience.trim()
      })

    if (insertError) {
      setError('Something went wrong. Please try again.')
      setSaving(false)
      return
    }

    setName('')
    setOffer('')
    setAudience('')
    setShowForm(false)
    setSaving(false)
    load()
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    await supabase.from('templates').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const handleCopyOffer = (offer: string, id: string) => {
    navigator.clipboard.writeText(offer)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return <ListSkeleton />

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Save your offers for reuse across campaigns</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            New Template
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Save new template</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SaaS outbound offer Q2"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer</label>
              <textarea
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g. We help B2B SaaS companies book 10+ demos per month using cold email"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
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

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-black text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Template'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setError('')
                  setName('')
                  setOffer('')
                  setAudience('')
                }}
                className="text-sm text-gray-500 hover:text-gray-900 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {templates.length === 0 && !showForm ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">No templates yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Save your first template
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {templates.map((t) => (
            <div key={t.id} className="px-5 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{t.offer}</p>
                  {t.target_audience && (
                    <p className="text-xs text-gray-400 mt-1">Audience: {t.target_audience}</p>
                  )}
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleCopyOffer(t.offer, t.id)}
                    className="text-xs text-gray-400 hover:text-gray-700"
                  >
                    {copied === t.id ? 'Copied!' : 'Copy offer'}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deleting === t.id}
                    className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                  >
                    {deleting === t.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
