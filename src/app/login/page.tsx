'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase'

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_WITH_STANDALONE_LINK'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/app'
  const paymentSuccess = searchParams.get('payment') === 'success'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createBrowserSupabase()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Enter your email above first.'); return }
    setLoading(true)
    const supabase = createBrowserSupabase()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/app`,
    })
    setResetSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d1f33] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-white font-black text-3xl tracking-tight">
              Pipe<span className="text-[#F5C518]">Sketch</span>Pro
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-[#1a2f4a] mb-1">
            {showReset ? 'Reset your password' : 'Log in to your account'}
          </h1>
          <p className="text-[#1a2f4a]/50 text-sm font-medium mb-6">
            {showReset
              ? "We'll send a reset link to your email."
              : 'Access your PipeSketchPro account.'}
          </p>

          {paymentSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
              <p className="text-green-800 font-bold text-sm">Payment successful!</p>
              <p className="text-green-700 text-sm font-medium mt-1">
                Check your email for a link to set your password, then log in here.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
          )}

          {resetSent ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-blue-800 font-bold">Check your email</p>
              <p className="text-blue-700 text-sm font-medium mt-1">
                We sent a password reset link to {email}.
              </p>
              <button
                onClick={() => { setShowReset(false); setResetSent(false) }}
                className="mt-3 text-[#2E6DA4] text-sm font-bold hover:underline"
              >
                Back to login
              </button>
            </div>
          ) : showReset ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a2f4a]/60 mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2E6DA4] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E6DA4] hover:bg-[#1f4f7a] text-white font-black py-3.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="w-full text-[#1a2f4a]/50 text-sm font-semibold hover:text-[#1a2f4a] transition-colors"
              >
                Back to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a2f4a]/60 mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2E6DA4] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1a2f4a]/60 mb-1 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2E6DA4] transition-colors"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-[#2E6DA4] text-xs font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E6DA4] hover:bg-[#1f4f7a] text-white font-black py-3.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          )}
        </div>

        {/* Signup CTA */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm font-medium">
            Don&apos;t have an account?{' '}
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5C518] font-bold hover:underline"
            >
              Start free trial →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d1f33] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2E6DA4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
