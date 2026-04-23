'use client'

import { useState } from 'react'
import Papa from 'papaparse'

interface Result {
  lead: {
    name: string
    company: string
    website: string
  }
  first_line: string
  email: string
}

interface ResultsTableProps {
  results: Result[]
  campaignName: string
}

export default function ResultsTable({ results, campaignName }: ResultsTableProps) {
  const [copied, setCopied] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedEmails, setEditedEmails] = useState<Record<number, string>>({})

  const getEmail = (index: number) => editedEmails[index] ?? results[index].email

  const handleCopy = (index: number) => {
    const email = getEmail(index)
    navigator.clipboard.writeText(email)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyFirstLine = (index: number) => {
    navigator.clipboard.writeText(results[index].first_line)
    setCopied(index * 1000)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleEdit = (index: number) => {
    if (!editedEmails[index]) {
      setEditedEmails((prev) => ({ ...prev, [index]: results[index].email }))
    }
    setEditingIndex(index)
  }

  const handleSaveEdit = (index: number) => {
    setEditingIndex(null)
  }

  const handleDownload = () => {
    const rows = results.map((r, i) => ({
      name: r.lead.name,
      company: r.lead.company,
      website: r.lead.website,
      first_line: r.first_line,
      email: getEmail(i)
    }))

    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${campaignName.replace(/\s+/g, '-').toLowerCase()}-emails.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getCleanEmailBody = (index: number) => {
    const email = getEmail(index)
    const firstLine = results[index].first_line
    if (!firstLine) return email
    const escaped = firstLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return email.replace(new RegExp(`^${escaped}\\.?\\s*`, 'i'), '').trim()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          {results.length} emails generated
        </h2>
        <button
          onClick={handleDownload}
          className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          Download CSV
        </button>
      </div>

      <div className="space-y-4">
        {results.map((r, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 animate-fade-in card-hover">

            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {r.lead.name || 'Unknown'} — {r.lead.company || 'Unknown'}
                </p>
                {r.lead.website && (
                  <p className="text-xs text-gray-400 mt-0.5">{r.lead.website}</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">First line</p>
                <button
                  onClick={() => handleCopyFirstLine(i)}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  {copied === i * 1000 ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-gray-700 italic">{r.first_line || '—'}</p>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</p>
                <div className="flex items-center gap-3">
                  {editingIndex === i ? (
                    <button
                      onClick={() => handleSaveEdit(i)}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(i)}
                      className="text-xs text-gray-400 hover:text-gray-700"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(i)}
                    className="text-xs text-gray-400 hover:text-gray-700"
                  >
                    {copied === i ? 'Copied!' : 'Copy email'}
                  </button>
                </div>
              </div>

              {editingIndex === i ? (
                <textarea
                  value={editedEmails[i] ?? r.email}
                  onChange={(e) =>
                    setEditedEmails((prev) => ({ ...prev, [i]: e.target.value }))
                  }
                  rows={6}
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              ) : (
                <div className="text-sm text-gray-700 space-y-2">
                  <p className="italic text-gray-600">{r.first_line}</p>
                  <p className="whitespace-pre-wrap">{getCleanEmailBody(i)}</p>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
