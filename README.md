# 🌙 Overnight React

> Fintech web application for managing overnight extra income with Firebase Google authentication, Stripe payments, and PWA capabilities.

[![Tests](https://img.shields.io/badge/tests-47%20passing-brightgreen)](./TEST_SUMMARY.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## 🚀 Features

- **🔐 Firebase Authentication** - Google Sign-In with secure session management
- **💳 Card Management** - Link multiple bank cards and manage overnight investments
- **🌃 Overnight Processing** - Automated scheduled processing (22:00 MSK) and redemption (07:00 MSK)
- **💰 Premium Subscriptions** - Stripe-powered monthly (990₽) and yearly (9,900₽) plans
- **📊 Analytics Dashboard** - Real-time earnings tracking with 30-day history charts
- **📱 PWA Support** - Installable progressive web app with offline capabilities
- **🌍 Multi-language** - English and Russian support (i18n)
- **🧪 Comprehensive Testing** - 47 tests with Vitest and React Testing Library

## 📸 Screenshots

*Add screenshots of your application here*

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **i18next** - Internationalization

### Backend
- **Express** - Node.js server
- **Firebase** - Authentication, Firestore, Cloud Functions
- **Stripe** - Payment processing
- **Drizzle ORM** - Type-safe database queries

### Testing
- **Vitest** - Unit & component testing
- **React Testing Library** - Component testing
- **jsdom** - DOM simulation

### DevOps
- **Vite** - Build tool
- **Firebase Functions** - Serverless backend
- **PWA** - Service worker for offline support

## 📦 Installation

### Prerequisites

- Node.js 20.x or higher
- Firebase CLI (`npm install -g firebase-tools`)
- Stripe account
- Firebase project

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/CherepinRO/overnight-react.git
   cd overnight-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root:
   ```env
   # Firebase
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Stripe
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_MONTHLY_PRICE_ID=price_...
   VITE_STRIPE_YEARLY_PRICE_ID=price_...
   
   # Session
   SESSION_SECRET=your_session_secret
   ```

4. **Initialize Firebase**
   ```bash
   firebase login
   firebase init
   ```

5. **Deploy Firebase Functions**
   ```bash
   firebase deploy --only functions
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npx vitest run

# Watch mode (auto-rerun on changes)
npx vitest

# Interactive UI
npx vitest --ui

# Coverage report
npx vitest run --coverage
```

### Test Coverage

- **47 tests** across 6 test files
- **Unit tests** for services and hooks
- **Component tests** for React components
- **100% critical path coverage**

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing documentation.

## 📚 Documentation

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete feature implementation
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing guide
- **[TEST_SUMMARY.md](./TEST_SUMMARY.md)** - Test results and coverage
- **[STRIPE_TESTING.md](./STRIPE_TESTING.md)** - Stripe testing guide
- **[DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md)** - Deployment guide

## 🏗️ Project Structure

```
overnight-react/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── __tests__/       # Test files
│   └── public/              # Static assets
├── server/                   # Express backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   └── storage.ts          # Storage interface
├── functions/               # Firebase Cloud Functions
│   └── index.js            # Scheduled & callable functions
├── shared/                  # Shared types & schemas
│   └── schema.ts           # Data models
└── docs/                    # Documentation
```

## 🔧 Configuration

### Firebase Cloud Functions

Three main functions are deployed:

1. **`scheduleOvernight`** - Runs daily at 22:00 MSK
   - Processes cards with overnight enabled
   - Calculates free balance (balance - 1000 - reserved)
   - Calls bank API to schedule overnight

2. **`redeemOvernight`** - Runs daily at 07:00 MSK
   - Fetches matured transactions
   - Redeems overnight investments
   - Updates user earnings
   - Sends push notifications

3. **`createCheckoutSession`** - Callable function
   - Creates Stripe checkout session
   - Handles premium subscriptions

### Stripe Products

- **Monthly Premium**: 990₽/month
- **Yearly Premium**: 9,900₽/year (17% savings)

### PWA Configuration

- **Manifest**: `client/public/manifest.json`
- **Service Worker**: `client/public/sw.js`
- **Icons**: 192x192 and 512x512 (replace placeholders)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy Functions
```bash
firebase deploy --only functions
```

### Deploy to Replit
The app is configured for Replit deployment with automatic workflows.

See [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) for detailed deployment steps.

## 🔐 Security

- ✅ Firebase Authentication with secure sessions
- ✅ Environment variables for sensitive data
- ✅ Stripe webhook signature verification
- ✅ HTTPS-only in production
- ✅ Session secret rotation
- ✅ Input validation with Zod schemas

## 🌍 Internationalization

The app supports multiple languages using `i18next`:

- 🇬🇧 English (default)
- 🇷🇺 Russian

Add new languages in `client/src/locales/`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript best practices
- Use conventional commits
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- **CherepinRO** - Initial work

## 🙏 Acknowledgments

- Firebase for authentication and cloud functions
- Stripe for payment processing
- shadcn/ui for beautiful components
- Replit for development environment

## 📞 Support

For support, please:
- Open an issue on GitHub
- Check the [documentation](./docs)
- Review the [testing guide](./TESTING_GUIDE.md)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Additional payment providers
- [ ] Advanced analytics dashboard
- [ ] Multiple currency support
- [ ] Social features
- [ ] Investment portfolio tracking

## 📊 Status

- **Build**: ✅ Passing
- **Tests**: ✅ 47/47 passing
- **Deployment**: ✅ Production ready
- **Documentation**: ✅ Complete

---

**Made with ❤️ by the Overnight React team**
