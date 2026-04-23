import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <span className="text-lg font-bold text-gray-900">ReplyMax</span>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/login"
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full mb-6">
          Built for cold email agencies
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Cold emails that actually<br />get replies
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          ReplyMax turns your lead list into personalized cold email campaigns in minutes — not hours. Built around a structured system, not generic AI writing.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Start for free
          </Link>
          <Link
            href="/pricing"
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-400"
          >
            See pricing
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">No credit card required to start</p>
      </section>

      {/* Problem */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Why most cold emails fail
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-lg">✗</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Generic messages</h3>
            <p className="text-sm text-gray-500">
              Blasting the same email to everyone. Recipients can tell instantly and ignore it.
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-lg">✗</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Shallow personalization</h3>
            <p className="text-sm text-gray-500">
              Using just a first name or company name. That stopped working years ago.
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-lg">✗</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">No system</h3>
            <p className="text-sm text-gray-500">
              Writing emails one by one in Claude with no memory of what worked before.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          How ReplyMax works
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Create a campaign', desc: 'Name your campaign and describe your offer in plain English.' },
            { step: '2', title: 'Upload your leads', desc: 'Drop in a CSV with name, company, and website.' },
            { step: '3', title: 'Generate emails', desc: 'Our RPS Engine maps each lead to a likely pain and writes around it.' },
            { step: '4', title: 'Export and send', desc: 'Copy emails directly or download as CSV for your sending tool.' }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                {item.step}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why not just use Claude */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Why not just use Claude directly?
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          Claude writes one email. ReplyMax runs campaigns.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <p className="text-sm font-semibold text-gray-400 mb-4">Using Claude manually</p>
            <ul className="space-y-3">
              {[
                'One email at a time',
                'No campaign structure',
                'No memory of past work',
                'No reuse across clients',
                'Starts from scratch every time'
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-red-400">✗</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-black rounded-xl p-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">Using ReplyMax</p>
            <ul className="space-y-3">
              {[
                'Entire lead list in one run',
                'Structured campaign system',
                'Full history saved automatically',
                'Templates reused across clients',
                'Duplicate campaigns in one click'
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Simple, honest pricing
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Start free. Upgrade when you need more volume.
        </p>
        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            { name: 'Starter', price: '$49', desc: '300 emails/month', sub: '1 campaign' },
            { name: 'Growth', price: '$149', desc: '1,500 emails/month', sub: 'Unlimited campaigns', highlight: true },
            { name: 'Agency', price: '$299', desc: '7,000 emails/month', sub: '3–5 team seats' }
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-5 border ${plan.highlight ? 'border-black' : 'border-gray-200'}`}
            >
              {plan.highlight && (
                <p className="text-xs font-medium bg-black text-white px-2 py-0.5 rounded-md inline-block mb-2">
                  Most popular
                </p>
              )}
              <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
              <p className="text-xs text-gray-400">{plan.sub}</p>
            </div>
          ))}
        </div>
        <Link
          href="/pricing"
          className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          View full pricing
        </Link>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to get more replies?
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Join agencies already using ReplyMax to run better cold email campaigns.
        </p>
        <Link
          href="/login"
          className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Get started free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">ReplyMax</span>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-xs text-gray-400 hover:text-gray-600">Pricing</Link>
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600">Login</Link>
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600">Sign up</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 ReplyMax</p>
        </div>
      </footer>

    </div>
  )
}
