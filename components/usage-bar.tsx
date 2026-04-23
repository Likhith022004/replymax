'use client'

import Link from 'next/link'
import { PLANS } from '@/lib/plans'

interface UsageBarProps {
  plan: string
  usageCount: number
}

export default function UsageBar({ plan, usageCount }: UsageBarProps) {
  const planConfig = PLANS[plan as keyof typeof PLANS] ?? PLANS.free
  const limit = planConfig.emails_per_month
  const percent = Math.min((usageCount / limit) * 100, 100)
  const remaining = Math.max(limit - usageCount, 0)
  const isWarning = percent >= 80
  const isMaxed = percent >= 100

  return (
    <div className={`rounded-xl p-4 border ${isMaxed ? 'border-red-200 bg-red-50' : isWarning ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">
          Email usage — <span className="capitalize font-medium">{planConfig.label}</span> plan
        </p>
        <p className={`text-sm font-medium ${isMaxed ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-600'}`}>
          {usageCount} / {limit}
        </p>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
        <div
          className={`h-1.5 rounded-full transition-all ${isMaxed ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-black'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {isMaxed && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-red-600">Monthly limit reached</p>
          <Link href="/pricing" className="text-xs font-medium text-red-600 underline">
            Upgrade now
          </Link>
        </div>
      )}

      {isWarning && !isMaxed && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-amber-600">{remaining} emails remaining</p>
          <Link href="/pricing" className="text-xs font-medium text-amber-600 underline">
            Upgrade plan
          </Link>
        </div>
      )}
    </div>
  )
}
