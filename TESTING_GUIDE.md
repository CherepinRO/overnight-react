# Testing Guide - Overnight React

## 📋 Overview

This project uses **Vitest** and **React Testing Library** for comprehensive unit and component testing. All tests are configured to run in a jsdom environment with full Firebase mocking.

## 🧪 Test Suite

### Test Coverage

```
✅ 47 Tests Passing
✅ 6 Test Files
✅ Unit Tests: Services & Hooks
✅ Component Tests: React Components
```

### Test Categories

1. **Unit Tests - Services**
   - `stripe.test.ts` - Stripe checkout & configuration
   - `cards.test.ts` - Card management operations

2. **Unit Tests - Hooks**
   - `useOvernight.test.ts` - Overnight data hook

3. **Component Tests**
   - `PaywallDialog.test.tsx` - Premium upgrade dialog
   - `Dashboard.test.tsx` - Main dashboard
   - `Cards.test.tsx` - Cards page

## 🚀 Running Tests

### Commands

```bash
# Run all tests
npx vitest run

# Run tests in watch mode
npx vitest

# Run tests with UI
npx vitest --ui

# Run tests with coverage
npx vitest run --coverage

# Run specific test file
npx vitest run client/src/__tests__/services/stripe.test.ts
```

### Test Scripts (Manual)

Since package.json cannot be modified, use these commands directly:

```bash
# Run once
npx vitest run

# Watch mode (auto-rerun on changes)
npx vitest

# Interactive UI
npx vitest --ui

# Coverage report
npx vitest run --coverage
```

## 📁 Test Structure

```
client/src/
├── __tests__/
│   ├── components/
│   │   ├── Cards.test.tsx
│   │   ├── Dashboard.test.tsx
│   │   └── PaywallDialog.test.tsx
│   ├── hooks/
│   │   └── useOvernight.test.ts
│   └── services/
│       ├── cards.test.ts
│       └── stripe.test.ts
└── test/
    ├── setup.ts          # Test configuration & mocks
    ├── types.d.ts        # TypeScript test types
    └── tsconfig.json     # Test TypeScript config
```

## 🔧 Configuration Files

### `vitest.config.ts`
- Configured for React + jsdom environment
- Path aliases (@, @shared, @assets)
- Coverage reporting with v8
- Global test utilities

### `client/src/test/setup.ts`
- Firebase mocking (auth, firestore, functions)
- DOM utilities (matchMedia, IntersectionObserver)
- Auto cleanup after each test

## 📝 Test Details

### Service Tests

#### `stripe.test.ts`
```typescript
✓ Get Stripe instance
✓ Handle missing configuration
✓ Redirect to checkout
✓ Product price IDs
✓ Product details (monthly/yearly)
```

**Key Features:**
- Mocks Stripe.js library
- Tests checkout redirect flow
- Validates product configuration
- Handles missing API keys

#### `cards.test.ts`
```typescript
✓ Get cards with delay simulation
✓ Add card with mock data
✓ Generate unique card IDs
✓ Toggle overnight status
✓ Update card balances with fluctuation
```

**Key Features:**
- Simulates 500ms network delay
- Validates card data structure
- Tests Firebase integration points
- Balance fluctuation algorithms

### Hook Tests

#### `useOvernight.test.ts`
```typescript
✓ Return empty state when auth loading
✓ Return empty state when user null
✓ Return empty state when db null
✓ Generate 30 days of earnings data
✓ Calculate total active amount
```

**Key Features:**
- Mocks useAuth hook
- Tests real-time data states
- Validates earnings calculations
- Firestore listener simulation

### Component Tests

#### `PaywallDialog.test.tsx`
```typescript
✓ Render dialog when open
✓ Don't render when closed
✓ Display amount in description
✓ Display monthly/yearly plans
✓ Highlight selected plan
✓ Switch between plans
✓ Best value badge on yearly
✓ Cancel button closes dialog
✓ Create checkout session & redirect
✓ Disable buttons when loading
✓ Display all premium features
```

**Key Features:**
- Tests user interactions (clicks, selections)
- Validates Stripe checkout flow
- Loading states and disabled buttons
- Premium feature display

#### `Dashboard.test.tsx`
```typescript
✓ Render loading state
✓ Display dashboard title & user
✓ Show last night earnings badge
✓ Hide earnings when zero
✓ Display stats cards with values
✓ Show empty state for no cards
✓ Render earnings chart
✓ Sign out button
```

**Key Features:**
- User authentication states
- Conditional rendering (earnings badge)
- Empty states
- Data visualization

#### `Cards.test.tsx`
```typescript
✓ Render loading state
✓ Display cards page title
✓ Show empty state
✓ Display list of cards
✓ Show card balances
✓ FAB button when cards exist
✓ Open link dialog on add
✓ Back button navigation
```

**Key Features:**
- List rendering
- Empty states
- Card linking flow
- Navigation

## 🎯 Mocking Strategy

### Firebase Mocks

All Firebase services are mocked in `test/setup.ts`:

```typescript
// Auth
vi.mock('firebase/auth')

// Firestore
vi.mock('firebase/firestore')

// Cloud Functions
vi.mock('firebase/functions')
```

### Component Mocks

```typescript
// Toast notifications
vi.mock('@/hooks/use-toast')

// Router
vi.mock('wouter')

// Services
vi.mock('@/services/cards')
vi.mock('@/services/auth')
```

## 📊 Coverage

To generate coverage reports:

```bash
npx vitest run --coverage
```

This creates:
- Text report in terminal
- HTML report in `coverage/` directory
- JSON report for CI/CD

### Coverage Exclusions

```typescript
- node_modules/
- client/src/test/
- **/*.d.ts
- **/*.config.*
- **/mockData
- **/types
```

## 🐛 Debugging Tests

### Run Single Test

```bash
npx vitest run client/src/__tests__/components/PaywallDialog.test.tsx
```

### Watch Mode for Specific File

```bash
npx vitest client/src/__tests__/services/stripe.test.ts
```

### Use Vitest UI

```bash
npx vitest --ui
```

Opens interactive dashboard at http://localhost:51204

### Console Logging

```typescript
// Add to any test
it('should do something', () => {
  console.log('Debug:', someValue);
  expect(someValue).toBe(expected);
});
```

## ✅ Writing New Tests

### Service Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { myFunction } from '@/services/myService';

describe('My Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', async () => {
    const result = await myFunction();
    expect(result).toBeDefined();
  });
});
```

### Component Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    
    expect(screen.getByTestId('my-element')).toBeInTheDocument();
  });

  it('should handle click', () => {
    render(<MyComponent />);
    
    fireEvent.click(screen.getByTestId('button-click'));
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

## 🔍 Common Patterns

### Testing Async Operations

```typescript
it('should fetch data', async () => {
  const { result } = renderHook(() => useMyHook());
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

### Testing User Events

```typescript
it('should handle user input', async () => {
  const user = userEvent.setup();
  render(<MyForm />);
  
  await user.type(screen.getByTestId('input-email'), 'test@example.com');
  await user.click(screen.getByTestId('button-submit'));
  
  expect(screen.getByText('Success!')).toBeInTheDocument();
});
```

### Testing with Mocked Data

```typescript
it('should display mocked data', async () => {
  vi.spyOn(myService, 'getData').mockResolvedValue([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]);
  
  render(<MyList />);
  
  await waitFor(() => {
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
```

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npx vitest run
      - run: npx vitest run --coverage
```

## 🚨 Troubleshooting

### Issue: Tests timing out
**Solution:** Increase timeout in vitest.config.ts
```typescript
test: {
  testTimeout: 30000, // 30 seconds
}
```

### Issue: Import path errors
**Solution:** Check path aliases in vitest.config.ts
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './client/src'),
  },
}
```

### Issue: Firebase errors in tests
**Solution:** Verify mocks in test/setup.ts
```typescript
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));
```

### Issue: Component not rendering
**Solution:** Check for missing providers
```typescript
render(
  <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
);
```

## 📚 Best Practices

1. **Always mock external services** (Firebase, Stripe, APIs)
2. **Use data-testid** for reliable element selection
3. **Test user behavior**, not implementation details
4. **Keep tests isolated** - no shared state between tests
5. **Use beforeEach** to reset mocks and state
6. **Test edge cases** - empty states, errors, loading
7. **Prefer waitFor** over arbitrary timeouts
8. **Use descriptive test names** - "should do X when Y"

## 🎓 Learning Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Mocking with Vitest](https://vitest.dev/guide/mocking.html)

## 📞 Support

For test-related issues:
1. Check test output: `npx vitest run --reporter=verbose`
2. Use UI mode: `npx vitest --ui`
3. Review mocks in `client/src/test/setup.ts`
4. Check configuration in `vitest.config.ts`

---

**Test Status:** ✅ 47/47 passing | Last Updated: October 2025
