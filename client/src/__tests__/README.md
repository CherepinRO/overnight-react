# Test Suite

## Quick Start

```bash
# Run all tests
npx vitest run

# Watch mode
npx vitest

# UI mode
npx vitest --ui
```

## Test Files

### Components
- `PaywallDialog.test.tsx` - Premium upgrade dialog (11 tests)
- `Dashboard.test.tsx` - Main dashboard (8 tests)
- `Cards.test.tsx` - Cards management page (8 tests)

### Services
- `stripe.test.ts` - Stripe integration (7 tests)
- `cards.test.ts` - Card operations (8 tests)

### Hooks
- `useOvernight.test.ts` - Overnight data hook (5 tests)

## Coverage

**Total: 47 tests passing**

See [TESTING_GUIDE.md](../../../TESTING_GUIDE.md) for detailed documentation.
