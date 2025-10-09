import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance
 */
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe publishable key not configured');
      return null;
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

/**
 * Redirect to Stripe Checkout
 * @param sessionId - Stripe checkout session ID from Cloud Function
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe();
  
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add VITE_STRIPE_PUBLIC_KEY to your environment.');
  }

  // Redirect to Stripe Checkout using the session ID
  window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
}

/**
 * Stripe product price IDs (configured in Firebase environment)
 * These should match the products created in Stripe Dashboard
 */
export const STRIPE_PRICES = {
  MONTHLY_RUB: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_990rub',
  YEARLY_RUB: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID || 'price_yearly_9900rub',
} as const;

/**
 * Product details for display
 */
export const PRODUCTS = {
  monthly: {
    name: 'Premium Monthly',
    price: 990,
    currency: '₽',
    interval: 'month',
    priceId: STRIPE_PRICES.MONTHLY_RUB,
  },
  yearly: {
    name: 'Premium Yearly',
    price: 9900,
    currency: '₽',
    interval: 'year',
    priceId: STRIPE_PRICES.YEARLY_RUB,
    savings: '17% savings',
  },
} as const;
