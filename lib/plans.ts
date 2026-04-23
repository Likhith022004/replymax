export const PLANS = {
  free: {
    emails_per_month: 5,
    max_campaigns: 1,
    label: 'Free'
  },
  starter: {
    emails_per_month: 300,
    max_campaigns: 1,
    label: 'Starter'
  },
  growth: {
    emails_per_month: 1500,
    max_campaigns: Infinity,
    label: 'Growth'
  },
  agency: {
    emails_per_month: 7000,
    max_campaigns: Infinity,
    label: 'Agency'
  }
}
