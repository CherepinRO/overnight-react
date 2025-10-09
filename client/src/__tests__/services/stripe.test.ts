import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStripe, redirectToCheckout, STRIPE_PRICES, PRODUCTS } from '@/services/stripe';

// Mock loadStripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn((key) => Promise.resolve({ key })),
}));

describe('Stripe Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  describe('getStripe', () => {
    it('should return null when VITE_STRIPE_PUBLIC_KEY is not set', () => {
      const originalEnv = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      import.meta.env.VITE_STRIPE_PUBLIC_KEY = '';
      
      const result = getStripe();
      
      expect(result).toBeNull();
      
      import.meta.env.VITE_STRIPE_PUBLIC_KEY = originalEnv;
    });

    it('should load Stripe when key is configured', async () => {
      import.meta.env.VITE_STRIPE_PUBLIC_KEY = 'pk_test_123';
      
      const stripe = await getStripe();
      
      expect(stripe).toBeDefined();
    });
  });

  describe('redirectToCheckout', () => {
    it('should redirect to Stripe checkout with session ID', async () => {
      import.meta.env.VITE_STRIPE_PUBLIC_KEY = 'pk_test_123';
      const sessionId = 'cs_test_123';
      
      await redirectToCheckout(sessionId);
      
      expect(window.location.href).toBe(`https://checkout.stripe.com/c/pay/${sessionId}`);
    });

    it('should throw error when Stripe is not configured', async () => {
      import.meta.env.VITE_STRIPE_PUBLIC_KEY = '';
      
      await expect(redirectToCheckout('cs_test_123')).rejects.toThrow(
        'Stripe is not configured'
      );
    });
  });

  describe('STRIPE_PRICES', () => {
    it('should have monthly and yearly price IDs', () => {
      expect(STRIPE_PRICES.MONTHLY_RUB).toBeDefined();
      expect(STRIPE_PRICES.YEARLY_RUB).toBeDefined();
    });
  });

  describe('PRODUCTS', () => {
    it('should have monthly product configuration', () => {
      expect(PRODUCTS.monthly).toEqual({
        name: 'Premium Monthly',
        price: 990,
        currency: '₽',
        interval: 'month',
        priceId: expect.any(String),
      });
    });

    it('should have yearly product configuration with savings', () => {
      expect(PRODUCTS.yearly).toEqual({
        name: 'Premium Yearly',
        price: 9900,
        currency: '₽',
        interval: 'year',
        priceId: expect.any(String),
        savings: '17% savings',
      });
    });
  });
});
