export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Simple pricing</h1>
        <p className="text-gray-500 mt-2">Pay for what you use. Upgrade when you need more.</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {[
          {
            name: 'Starter',
            price: '$49',
            features: ['300 emails/month', '1 active campaign', 'CSV upload', 'Copy + download'],
            highlighted: false
          },
          {
            name: 'Growth',
            price: '$149',
            features: ['1,500 emails/month', 'Unlimited campaigns', 'Templates + duplication', 'Priority processing'],
            highlighted: true
          },
          {
            name: 'Agency',
            price: '$299',
            features: ['7,000 emails/month', 'Unlimited campaigns', '3–5 team seats', 'Full workflow access'],
            highlighted: false
          }
        ].map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-xl p-6 border ${
              plan.highlighted
                ? 'border-black ring-1 ring-black'
                : 'border-gray-200'
            }`}
          >
            {plan.highlighted && (
              <p className="text-xs font-medium text-white bg-black px-2 py-0.5 rounded-md inline-block mb-3">
                Most popular
              </p>
            )}
            <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="w-full text-center text-sm text-gray-500 border border-gray-200 rounded-lg py-2">
              Coming soon
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Payments launching soon. Contact us at replymax001@gmail.com to get early access.
      </p>
    </div>
  )
}
