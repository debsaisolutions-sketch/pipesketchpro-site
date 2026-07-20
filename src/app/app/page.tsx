'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase'

type Status = 'loading' | 'active' | 'no_subscription' | 'error'

export default function AppPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('loading')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkAccess = async () => {
      const supabase = createBrowserSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/login?redirect=/app')
        return
      }

      setUserEmail(session.user.email || '')
      const userId = session.user.id

      try {
        // Use the signed-in user's JWT (RLS) — never service_role in the browser.
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('psp_standalone,pipesketchpro_active')
          .eq('id', userId)
          .maybeSingle()

        if (error) throw error

        if (profile?.psp_standalone === true || profile?.pipesketchpro_active === true) {
          setStatus('active')
        } else {
          setStatus('no_subscription')
        }
      } catch {
        setStatus('error')
      }
    }

    checkAccess()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0d1f33] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2E6DA4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm font-medium">Loading your workspace…</p>
        </div>
      </div>
    )
  }

  if (status === 'no_subscription') {
    return (
      <div className="min-h-screen bg-[#0d1f33] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-[#1a2f4a] mb-2">No active subscription</h1>
          <p className="text-[#1a2f4a]/60 font-medium mb-6 text-sm">
            Your account <strong>{userEmail}</strong> doesn&apos;t have an active PipeSketchPro subscription.
          </p>
          <div className="space-y-3">
            <a
              href="https://buy.stripe.com/8x2fZgdrOfGT79DgJ37N601"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#F5C518] hover:bg-yellow-400 text-[#1a2f4a] font-black py-3.5 rounded-xl transition-colors"
            >
              Start Free 7-Day Trial — $49/month after
            </a>
            <a
              href="https://www.tradedeskpro.net"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#2E6DA4] hover:bg-[#1f4f7a] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              Get TradeDeskPro + PipeSketchPro for $29/month →
            </a>
            <button
              onClick={handleSignOut}
              className="block w-full text-[#1a2f4a]/40 text-sm font-medium hover:text-[#1a2f4a] transition-colors py-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#0d1f33] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-black text-[#1a2f4a] mb-2">Something went wrong</h1>
          <p className="text-[#1a2f4a]/60 text-sm font-medium mb-5">
            We couldn&apos;t verify your subscription. Please try refreshing.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2E6DA4] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1f4f7a] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // status === 'active' — show the tool
  return (
    <div className="fixed inset-0 flex flex-col bg-[#0d1f33]">
      {/* Header bar */}
      <div className="h-12 bg-[#1a2f4a] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔧</span>
          <span className="text-[#F5C518] font-black text-base tracking-tight">
            Pipe<span className="text-white">Sketch</span>Pro
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs font-medium hidden sm:block">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="text-white/50 hover:text-white text-xs font-semibold transition-colors"
          >
            Sign out
          </button>
          <Link
            href="/"
            className="text-white/50 hover:text-white text-xs font-semibold transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </div>

      {/* Tool iframe */}
      <iframe
        src="https://field-pipe-iso.vercel.app/"
        title="PipeSketchPro"
        className="flex-1 w-full border-none"
        allow="fullscreen"
      />
    </div>
  )
}
