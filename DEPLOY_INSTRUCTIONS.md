# Firebase Cloud Functions Deployment Instructions

## Prerequisites

1. **Install Firebase CLI globally:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase project (if not already done):**
   ```bash
   firebase init
   ```
   - Select "Functions" when prompted
   - Choose JavaScript as the language
   - Choose to use ESLint
   - Install dependencies with npm

## Install Function Dependencies

Navigate to the functions folder and install dependencies:

```bash
cd functions
npm install
```

This will install:
- `firebase-admin` - Firebase Admin SDK for backend operations
- `firebase-functions` - Cloud Functions SDK
- `node-cron` - For scheduling (used in the functions)
- `axios` - HTTP client for API calls

## Deploy Functions to Firebase

### Deploy All Functions

From the project root:

```bash
firebase deploy --only functions
```

### Deploy Specific Functions

To deploy only the overnight scheduling function:

```bash
firebase deploy --only functions:scheduleOvernight
```

To deploy only the redemption function:

```bash
firebase deploy --only functions:redeemOvernight
```

### Deploy Test Functions (Optional)

The test functions allow manual triggering for development:

```bash
firebase deploy --only functions:testScheduleOvernight,functions:testRedeemOvernight
```

## Function Schedules

### scheduleOvernight
- **Schedule:** Daily at 22:00 MSK (19:00 UTC)
- **Cron:** `0 19 * * *`
- **Purpose:** Schedules overnight investments for cards with `overnight=true`

### redeemOvernight
- **Schedule:** Daily at 07:00 MSK (04:00 UTC)
- **Cron:** `0 4 * * *`
- **Purpose:** Redeems matured overnight investments and sends notifications

## Testing Functions Locally

### Start Firebase Emulator

```bash
cd functions
npm run serve
```

This starts the Firebase Functions emulator for local testing.

### Test Functions via HTTP (Development Only)

The test functions can be triggered manually:

```bash
# Test overnight scheduling
curl https://YOUR-PROJECT.cloudfunctions.net/testScheduleOvernight

# Test overnight redemption
curl https://YOUR-PROJECT.cloudfunctions.net/testRedeemOvernight
```

## View Function Logs

To view real-time logs from deployed functions:

```bash
firebase functions:log
```

To view logs for a specific function:

```bash
firebase functions:log --only scheduleOvernight
```

## Important Notes

### Environment Configuration

- Update the mock bank API URLs in `functions/index.js` when ready for production:
  ```javascript
  const MOCK_BANK_API = {
    overnight: "https://your-bank-api.com/overnight",
    redeem: "https://your-bank-api.com/redeem",
  };
  ```

### Timezone

- Functions are scheduled in UTC
- 22:00 MSK = 19:00 UTC
- 07:00 MSK = 04:00 UTC

### Firestore Structure

The functions expect this Firestore structure:

```
users/{userId}/
  ├── profile/data - { totalEarned, fcmToken }
  ├── cards/{cardId} - { balance, overnight, reserved }
  └── overnights/{txnId} - { amount, state, interest, scheduledAt, matureAt }
```

### Push Notifications

For push notifications to work:
- Users must have an FCM token stored in `users/{uid}/profile/data.fcmToken`
- Configure Firebase Cloud Messaging in your Firebase Console

## Quick Commands Reference

```bash
# Full deployment
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:scheduleOvernight

# View logs
firebase functions:log

# Local testing
cd functions && npm run serve
```

## Troubleshooting

### Error: "Firebase not initialized"
Make sure you've run `firebase login` and your project is properly configured in `.firebaserc`

### Error: "Insufficient permissions"
Ensure your Firebase project has Firestore and Cloud Functions enabled in the Firebase Console

### Functions not triggering on schedule
- Check the Firebase Console > Functions tab for execution history
- Verify timezone configuration
- Check function logs for errors

## Cost Considerations

- Scheduled functions run daily (2 invocations per day)
- Each function may make multiple Firestore reads/writes
- Monitor usage in Firebase Console > Usage tab
