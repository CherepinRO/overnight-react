# Stripe Testing Guide

## Environment Setup

### Required Environment Variables

Add these to your `.env` file or Replit Secrets:

```bash
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Price IDs (create products in Stripe Dashboard)
VITE_STRIPE_MONTHLY_PRICE_ID=price_...  # Monthly 990 RUB
VITE_STRIPE_YEARLY_PRICE_ID=price_...   # Yearly 9,900 RUB

# Firebase Function Environment (optional, defaults to localhost:5000)
APP_URL=https://your-app.replit.app
```

## Create Stripe Products

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)

2. **Create Monthly Product:**
   - Click "Add product"
   - Name: "Premium Monthly"
   - Description: "Monthly premium subscription"
   - Pricing: Recurring
   - Price: 990 RUB
   - Billing period: Monthly
   - Copy the **Price ID** (starts with `price_`) to `VITE_STRIPE_MONTHLY_PRICE_ID`

3. **Create Yearly Product:**
   - Click "Add product"
   - Name: "Premium Yearly"
   - Description: "Yearly premium subscription with savings"
   - Pricing: Recurring
   - Price: 9,900 RUB
   - Billing period: Yearly
   - Copy the **Price ID** (starts with `price_`) to `VITE_STRIPE_YEARLY_PRICE_ID`

## Test Cards

Stripe provides test cards for different scenarios:

### Successful Payments

| Card Number         | Description                    |
|---------------------|--------------------------------|
| 4242 4242 4242 4242 | Visa - successful payment      |
| 5555 5555 5555 4444 | Mastercard - successful        |
| 378282246310005     | American Express - successful  |

### Payment Failures

| Card Number         | Description                    |
|---------------------|--------------------------------|
| 4000 0000 0000 0002 | Card declined                  |
| 4000 0000 0000 9995 | Insufficient funds             |
| 4000 0000 0000 0069 | Expired card                   |

### 3D Secure Authentication

| Card Number         | Description                    |
|---------------------|--------------------------------|
| 4000 0027 6000 3184 | 3D Secure - authentication required |

**For all test cards:**
- Use any future expiration date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any billing ZIP code (e.g., 12345)

## Testing Flow

### 1. Premium Paywall Test

```bash
# Navigate to dashboard
# Try to enable overnight for a card with amount > 100,000
# Should show PaywallDialog
```

### 2. Checkout Flow Test

1. Click "Upgrade to Premium" in PaywallDialog
2. Select Monthly or Yearly plan
3. Click "Upgrade" button
4. Cloud Function creates checkout session
5. Redirected to Stripe Checkout
6. Use test card: `4242 4242 4242 4242`
7. Complete payment
8. Redirected to `/stripe-success?session_id=...`
9. Verify success message displayed

### 3. Subscription Verification

Check in [Stripe Dashboard → Customers](https://dashboard.stripe.com/customers):
- New customer created with user's email
- Active subscription listed
- Payment successful

## Cloud Functions Testing

### Deploy Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions:createCheckoutSession
```

### Test Locally (Emulator)

```bash
cd functions
npm run serve
```

Then update your frontend to use local function:
```javascript
// In development
const functions = getFunctions();
connectFunctionsEmulator(functions, "localhost", 5001);
```

## Common Issues

### Issue: "Stripe is not configured"
**Solution:** Ensure `VITE_STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` are set

### Issue: "Invalid price ID"
**Solution:** Verify price IDs match products in Stripe Dashboard

### Issue: "Checkout session failed"
**Solution:** Check Cloud Function logs:
```bash
firebase functions:log --only createCheckoutSession
```

### Issue: "Redirect not working"
**Solution:** 
- Verify `APP_URL` environment variable is set
- Check success_url and cancel_url in checkout session

## Webhook Setup (Production)

For production, set up webhooks to handle subscription events:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-app.com/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Security Notes

⚠️ **Never commit Stripe secret keys to version control**
- Use environment variables or Replit Secrets
- Test keys start with `sk_test_`
- Live keys start with `sk_live_`

✅ **Best Practices:**
- Use test mode during development
- Validate webhook signatures in production
- Log all payment events for audit trail
- Handle failed payments gracefully
