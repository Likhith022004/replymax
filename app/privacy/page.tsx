export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: April 2026</p>

      <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account including your email address. We also collect usage data such as campaigns created and emails generated to provide and improve our service.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p>We use your information to provide the ReplyMax service, process payments, send service-related emails, and improve our platform. We do not sell your personal information to third parties.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Data Storage</h2>
          <p>Your data is stored securely using Supabase infrastructure. Campaign data, lead lists, and generated emails are stored to provide campaign history functionality. You can request deletion of your data at any time.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Cookies</h2>
          <p>We use essential cookies to maintain your login session. We do not use tracking or advertising cookies.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Third Party Services</h2>
          <p>We use Paddle for payment processing and Supabase for data storage. These services have their own privacy policies and handle data according to their terms.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at replymax001@gmail.com and we will respond within 30 days.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Contact</h2>
          <p>For privacy questions, contact us at replymax001@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

