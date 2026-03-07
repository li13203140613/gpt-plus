import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe() {
  if (!_stripe) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!stripeSecretKey) throw new Error('Missing STRIPE_SECRET_KEY')
    _stripe = new Stripe(stripeSecretKey)
  }
  return _stripe
}
