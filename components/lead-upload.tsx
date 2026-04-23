'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'

interface Lead {
  name: string
  company: string
  website: string
}

interface LeadUploadProps {
  onLeadsReady: (leads: Lead[]) => void
}

export default function LeadUpload({ onLeadsReady }: LeadUploadProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError('')
    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        const rows = results.data as any[]

        if (rows.length === 0) {
          setError('CSV file is empty.')
          return
        }

        const firstRow = rows[0]
        if (!firstRow.name && !firstRow.company) {
          setError('CSV must have at least a "name" or "company" column.')
          return
        }

        if (rows.length > 500) {
          setError('Maximum 500 leads per upload. Please split your CSV.')
          return
        }

        const parsed: Lead[] = rows.map((row) => ({
          name: String(row.name ?? '').trim(),
          company: String(row.company ?? '').trim(),
          website: String(row.website ?? '').trim()
        }))

        setLeads(parsed)
        onLeadsReady(parsed)
      },
      error: () => {
        setError('Could not parse CSV. Please check the file format.')
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) {
      handleFile(file)
    } else {
      setError('Please upload a .csv file.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = () => {
    setLeads([])
    setFileName('')
    setError('')
    onLeadsReady([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      {leads.length === 0 ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <p className="text-gray-500 text-sm mb-1">Drag and drop your CSV here</p>
          <p className="text-gray-400 text-xs">or click to browse</p>
          <p className="text-gray-300 text-xs mt-3">Required columns: name, company — website is optional</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-400">{leads.length} leads ready</p>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Remove
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">Name</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">Company</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.slice(0, 5).map((lead, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-gray-700">{lead.name || '—'}</td>
                    <td className="px-4 py-2 text-gray-700">{lead.company || '—'}</td>
                    <td className="px-4 py-2 text-gray-400 text-xs truncate max-w-[160px]">{lead.website || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length > 5 && (
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400">
                + {leads.length - 5} more leads
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-3">{error}</p>
      )}
    </div>
  )
}
