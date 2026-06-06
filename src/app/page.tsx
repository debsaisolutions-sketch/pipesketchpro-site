import Link from 'next/link'

// TODO: Replace with your actual Stripe standalone payment link
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/8x2fZgdrOfGT79DgJ37N601'

export default function HomePage() {
  return (
    <div className="font-montserrat">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a2f4a]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-white font-bold text-lg tracking-tight">
            Pipe<span className="text-[#F5C518]">Sketch</span>Pro
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white/70 text-sm font-semibold hover:text-white transition-colors"
            >
              Log In
            </Link>
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F5C518] text-[#1a2f4a] text-sm font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#0d1f33] via-[#1a3a5c] to-[#0d1f33] min-h-screen flex items-center pt-14">
        <div className="max-w-5xl mx-auto px-4 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#2E6DA4]/30 border border-[#2E6DA4]/50 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-white/80 text-sm font-semibold">Field-ready · Works on any phone</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Draw your pipe run<br />
            on your phone.<br />
            <span className="text-[#F5C518]">Send the PDF</span> to your crew.<br />
            Done.
          </h1>

          <p className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            PipeSketchPro gives plumbers, pipefitters, welders, and HVAC techs a fast,
            simple way to sketch pipe isometrics and generate a material list —
            right from the job site.
          </p>

          <div className="flex flex-col items-center gap-3">
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#F5C518] hover:bg-yellow-400 text-[#0d1f33] text-xl font-black px-10 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#F5C518]/20"
            >
              Start Free 7-Day Trial — $49/month after
            </a>
            <p className="text-white/40 text-sm font-medium">Card required. Cancel anytime.</p>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {[
              { label: 'Trades using it', value: '1,200+' },
              { label: 'PDFs exported', value: '18,000+' },
              { label: 'Avg. time saved / job', value: '45 min' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black text-[#F5C518]">{value}</p>
                <p className="text-white/50 text-sm font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1a2f4a] mb-3">How it works</h2>
            <p className="text-[#1a2f4a]/60 text-lg font-medium">Three steps. No training. No CAD. No office.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: '📐',
                title: 'Enter your pipe runs',
                body: 'Pick pipe size, material, and fittings right from your phone. Add offsets, elbows, tees, and reducers as you walk the job.',
              },
              {
                step: '02',
                icon: '⚡',
                title: 'Get your drawing instantly',
                body: "PipeSketchPro builds a clean isometric drawing and auto-generates the full bill of materials — no manual counting, no guessing.",
              },
              {
                step: '03',
                icon: '📤',
                title: 'Export PDF. Send to crew.',
                body: "Tap export. Send the PDF by text or email. Your crew never needs an account — the PDF has everything they need to run the job.",
              },
            ].map(({ step, icon, title, body }) => (
              <div key={step} className="relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#2E6DA4]/30 transition-all hover:shadow-lg group">
                <div className="absolute -top-4 left-8 bg-[#2E6DA4] text-white text-xs font-black px-3 py-1 rounded-full tracking-widest">
                  STEP {step}
                </div>
                <div className="text-4xl mb-4 mt-2">{icon}</div>
                <h3 className="text-xl font-black text-[#1a2f4a] mb-3">{title}</h3>
                <p className="text-[#1a2f4a]/60 font-medium leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. WHO IT'S FOR
      ══════════════════════════════════════ */}
      <section className="bg-[#f7f9fc] py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1a2f4a] mb-3">Built for the trades</h2>
            <p className="text-[#1a2f4a]/60 text-lg font-medium">If you run pipe for a living, this tool is for you.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                trade: '🔧 Plumbers',
                body: "Rough-in and finish plumbing sketches done in minutes. Stop calculating offsets by hand on a dirty notepad.",
              },
              {
                trade: '⚙️ Pipefitters',
                body: "Complex iso drawings without a drafting table. Get a professional-grade sketch right from the mechanical room.",
              },
              {
                trade: '🔥 Welders',
                body: "Send a clean PDF spoolsheet to the shop before you leave the site. No more hand drawings that nobody can read.",
              },
              {
                trade: '❄️ HVAC Techs',
                body: "Refrigerant and gas piping layouts built fast. Export to PDF and hand it to the apprentice — they'll know exactly what to run.",
              },
              {
                trade: '🏗️ General Contractors',
                body: "Coordinate with your plumbing and mechanical subs using clear sketches. Stop playing phone tag over something that could be a PDF.",
              },
            ].map(({ trade, body }) => (
              <div key={trade} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2E6DA4]/30 transition-all hover:shadow-md">
                <p className="text-xl font-black text-[#1a2f4a] mb-2">{trade}</p>
                <p className="text-[#1a2f4a]/60 font-medium leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. FEATURES
      ══════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1a2f4a] mb-3">Everything you need. Nothing you don&apos;t.</h2>
            <p className="text-[#1a2f4a]/60 text-lg font-medium">Designed for contractors who work with their hands, not their keyboards.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: '📱',
                title: 'Works on any phone or tablet',
                body: 'No CAD knowledge needed. If you can tap a screen, you can use PipeSketchPro.',
              },
              {
                icon: '📋',
                title: 'Auto-generates bill of materials',
                body: 'Every fitting, every foot of pipe — automatically counted and listed as you draw.',
              },
              {
                icon: '📄',
                title: 'Export print-ready PDF in one tap',
                body: "Your drawing plus your material list in one professional document, ready to share.",
              },
              {
                icon: '🚫',
                title: 'Crew never needs an account',
                body: "The PDF does the job. Send it via text or email — zero friction for the people in the field.",
              },
              {
                icon: '⏱️',
                title: 'No office. No CAD software. No wasted time.',
                body: "Do it on-site, during the walkthrough, before you leave the job. That\'s it.",
              },
              {
                icon: '🔒',
                title: 'Drawings saved to your account',
                body: 'All your pipe sketches are saved and accessible from any device, anytime.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#2E6DA4]/20 hover:bg-[#f7f9fc] transition-all">
                <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
                <div>
                  <p className="font-black text-[#1a2f4a] mb-1">{title}</p>
                  <p className="text-[#1a2f4a]/55 text-sm font-medium leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. TRIAL CTA
      ══════════════════════════════════════ */}
      <section className="bg-[#2E6DA4] py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Try PipeSketchPro<br />free for 7 days
          </h2>
          <p className="text-white/70 text-xl font-medium mb-10">
            $49/month after your trial. Cancel anytime.
          </p>
          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#F5C518] hover:bg-yellow-400 text-[#1a2f4a] text-xl font-black px-10 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-black/20"
          >
            Start Free Trial
          </a>
          <p className="text-white/40 text-sm font-medium mt-4">Card required. Cancel anytime. No questions asked.</p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {['Works on iOS & Android', 'No CAD skills needed', 'Cancel anytime'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/70 text-sm font-semibold">
                <svg className="w-4 h-4 text-[#F5C518] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. TDP UPSELL
      ══════════════════════════════════════ */}
      <section className="bg-[#0d1f33] py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#1a2f4a] to-[#0d2040] rounded-3xl p-8 md:p-12 border border-[#2E6DA4]/30">

            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-block bg-[#F5C518]/10 border border-[#F5C518]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[#F5C518] text-sm font-black tracking-wide">CONTRACTOR BUNDLE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5C518] mb-5 leading-tight">
                Want PipeSketchPro for half price<br />
                — plus a full contractor<br className="hidden sm:block" /> business dashboard?
              </h2>
              <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Get PipeSketchPro for just <span className="text-white font-black">$29/month</span> when you subscribe to{' '}
                <span className="text-[#F5C518] font-black">TradeDeskPro</span> — the all-in-one business operating system
                built for service contractors.
              </p>
            </div>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {[
                { icon: '🤖', name: 'Grace AI Receptionist', desc: 'Answers every call 24/7, qualifies leads, books appointments' },
                { icon: '📥', name: 'Universal Inbox', desc: 'Every lead from every channel in one place' },
                { icon: '📊', name: 'Pipeline & Job Board', desc: 'Track every job from lead to paid' },
                { icon: '📱', name: 'Two-Way SMS & Email', desc: 'Text and email customers from one place' },
                { icon: '📅', name: 'Calendar & Scheduling', desc: "Never miss an appointment" },
                { icon: '📄', name: 'Contracts & E-Signature', desc: 'Send and sign from your phone' },
                { icon: '⭐', name: 'Review Automation', desc: 'Get more 5-star reviews automatically' },
                { icon: '💰', name: 'Financial Tracking', desc: 'Payments, expenses, profit at a glance' },
              ].map(({ icon, name, desc }) => (
                <div key={name} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{name}</p>
                    <p className="text-white/50 text-xs font-medium mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* PipeSketchPro callout */}
            <div className="flex items-center gap-3 bg-[#F5C518]/10 border border-[#F5C518]/30 rounded-xl p-4 mb-10">
              <span className="text-2xl shrink-0">🔧</span>
              <div>
                <p className="text-[#F5C518] font-black">PipeSketchPro included as add-on</p>
                <p className="text-white/60 text-sm font-medium mt-0.5">
                  <span className="line-through text-white/30">$49/month standalone</span>
                  <span className="ml-2 text-[#F5C518] font-black">$29/month with TradeDeskPro — half the price</span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="https://www.tradedeskpro.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#F5C518] hover:bg-yellow-400 text-[#0d1f33] text-xl font-black px-10 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#F5C518]/10"
              >
                Get TradeDeskPro + PipeSketchPro →
              </a>
              <p className="text-white/30 text-sm font-medium mt-3">tradedeskpro.net</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7. FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#0a1828] border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white/70 font-bold text-lg">
                Pipe<span className="text-[#F5C518]">Sketch</span>Pro
              </p>
              <p className="text-white/30 text-xs font-medium mt-1">
                © {new Date().getFullYear()} TradeDeskPro / True Freedom Holdings. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="/privacy" className="text-white/40 hover:text-white/70 font-medium transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white/40 hover:text-white/70 font-medium transition-colors">
                Terms of Service
              </a>
              <a
                href="https://www.tradedeskpro.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5C518]/60 hover:text-[#F5C518] font-medium transition-colors"
              >
                tradedeskpro.net
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
