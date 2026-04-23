'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setEmail(user.email ?? '')
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-base md:text-lg font-bold text-gray-900 flex-shrink-0">ReplyMax</span>
          <div className="flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide">
            <Link href="/dashboard" className="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">Dashboard</Link>
            <Link href="/campaigns" className="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">Campaigns</Link>
            <Link href="/templates" className="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">Templates</Link>
            <Link href="/pricing" className="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-2">
          <span className="text-xs md:text-sm text-gray-500 hidden sm:block truncate max-w-[120px] md:max-w-none">{email}</span>
          <button
            onClick={handleLogout}
            className="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  )
}
