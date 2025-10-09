/**
 * Firebase Cloud Functions for Overnight Income Processing
 * 
 * This file contains scheduled functions that:
 * 1. Schedule overnight investments at 22:00 MSK
 * 2. Redeem matured investments at 07:00 MSK
 * 3. Create Stripe checkout sessions for premium subscriptions
 */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const axios = require("axios");
const Stripe = require("stripe");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Mock Bank API endpoints (replace with actual bank API)
const MOCK_BANK_API = {
  overnight: "https://mock-bank-api.example.com/overnight",
  redeem: "https://mock-bank-api.example.com/redeem",
};

/**
 * Scheduled Function: Schedule Overnight Investments
 * 
 * Runs daily at 22:00 MSK (19:00 UTC)
 * 
 * Process:
 * 1. Fetches all users from Firestore
 * 2. For each user, gets their linked cards
 * 3. For cards with overnight=true:
 *    - Calculates free balance: balance - 1000 - reserved
 *    - If free balance > 0, calls mock bank API to schedule overnight
 *    - Writes transaction to users/{uid}/overnights/{txnId}
 */
exports.scheduleOvernight = onSchedule(
  {
    schedule: "0 19 * * *", // 19:00 UTC = 22:00 MSK
    timeZone: "UTC",
    memory: "256MiB",
  },
  async (event) => {
    const db = admin.firestore();
    const functions = require("firebase-functions");

    try {
      functions.logger.info("Starting overnight scheduling at 22:00 MSK");

      // Get all users
      const usersSnapshot = await db.collection("users").get();

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;

        try {
          // Get user's cards
          const cardsSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("cards")
            .where("overnight", "==", true)
            .get();

          for (const cardDoc of cardsSnapshot.docs) {
            const card = cardDoc.data();
            const cardId = cardDoc.id;

            // Calculate free balance
            // freeBalance = balance - 1000 (safety buffer) - reserved
            const safetyBuffer = 1000;
            const reserved = card.reserved || 0;
            const freeBalance = card.balance - safetyBuffer - reserved;

            if (freeBalance > 0) {
              functions.logger.info(
                `Processing overnight for user ${userId}, card ${cardId}, amount ${freeBalance}`
              );

              try {
                // Call mock bank API to schedule overnight
                const bankResponse = await axios.post(
                  MOCK_BANK_API.overnight,
                  {
                    cardId: cardId,
                    amount: freeBalance,
                    userId: userId,
                  },
                  {
                    timeout: 10000,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                // Generate transaction ID
                const txnId = `ovn_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`;

                // Write transaction to Firestore
                const transaction = {
                  id: txnId,
                  userId: userId,
                  cardId: cardId,
                  amount: freeBalance,
                  state: "active", // active, matured, returned
                  interest: 0,
                  scheduledAt: admin.firestore.FieldValue.serverTimestamp(),
                  matureAt: admin.firestore.Timestamp.fromDate(
                    new Date(Date.now() + 9 * 60 * 60 * 1000) // Matures in 9 hours (07:00 MSK)
                  ),
                  bankTxnId: bankResponse.data?.txnId || null,
                };

                await db
                  .collection("users")
                  .doc(userId)
                  .collection("overnights")
                  .doc(txnId)
                  .set(transaction);

                // Update card's reserved amount
                await db
                  .collection("users")
                  .doc(userId)
                  .collection("cards")
                  .doc(cardId)
                  .update({
                    reserved: admin.firestore.FieldValue.increment(freeBalance),
                  });

                functions.logger.info(
                  `Successfully scheduled overnight ${txnId} for ${freeBalance}`
                );
              } catch (apiError) {
                functions.logger.error(
                  `Bank API error for user ${userId}, card ${cardId}:`,
                  apiError.message
                );
                // Continue with next card even if one fails
              }
            } else {
              functions.logger.info(
                `Skipping card ${cardId} - insufficient free balance: ${freeBalance}`
              );
            }
          }
        } catch (userError) {
          functions.logger.error(
            `Error processing user ${userId}:`,
            userError.message
          );
          // Continue with next user even if one fails
        }
      }

      functions.logger.info("Overnight scheduling completed successfully");
      return {success: true, message: "Overnight scheduling completed"};
    } catch (error) {
      functions.logger.error("Fatal error in scheduleOvernight:", error);
      throw error;
    }
  }
);

/**
 * Scheduled Function: Redeem Overnight Investments
 * 
 * Runs daily at 07:00 MSK (04:00 UTC)
 * 
 * Process:
 * 1. Fetches all matured overnight transactions (matureAt <= now)
 * 2. For each transaction:
 *    - Calls mock bank /redeem API
 *    - Updates transaction state to 'returned'
 *    - Adds interest to user's totalEarned
 *    - Reduces card's reserved amount
 *    - Sends push notification via Firebase Cloud Messaging
 */
exports.redeemOvernight = onSchedule(
  {
    schedule: "0 4 * * *", // 04:00 UTC = 07:00 MSK
    timeZone: "UTC",
    memory: "256MiB",
  },
  async (event) => {
    const db = admin.firestore();
    const functions = require("firebase-functions");

    try {
      functions.logger.info("Starting overnight redemption at 07:00 MSK");

      const now = admin.firestore.Timestamp.now();

      // Get all users
      const usersSnapshot = await db.collection("users").get();

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        let totalEarningsToday = 0;

        try {
          // Get matured overnight transactions for this user
          const maturedSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("overnights")
            .where("state", "==", "active")
            .where("matureAt", "<=", now)
            .get();

          if (maturedSnapshot.empty) {
            functions.logger.info(`No matured transactions for user ${userId}`);
            continue;
          }

          for (const txnDoc of maturedSnapshot.docs) {
            const txn = txnDoc.data();
            const txnId = txnDoc.id;

            try {
              // Call mock bank API to redeem
              const redeemResponse = await axios.post(
                MOCK_BANK_API.redeem,
                {
                  bankTxnId: txn.bankTxnId,
                  txnId: txnId,
                  amount: txn.amount,
                },
                {
                  timeout: 10000,
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              // Calculate interest (mock: 0.1% overnight rate)
              const interestRate = 0.001; // 0.1%
              const interest = Math.floor(txn.amount * interestRate * 100) / 100;

              // Update transaction state
              await db
                .collection("users")
                .doc(userId)
                .collection("overnights")
                .doc(txnId)
                .update({
                  state: "returned",
                  interest: interest,
                  returnedAt: admin.firestore.FieldValue.serverTimestamp(),
                  bankRedeemId: redeemResponse.data?.redeemId || null,
                });

              // Update user's total earned
              const userProfileRef = db
                .collection("users")
                .doc(userId)
                .collection("profile")
                .doc("data");

              await userProfileRef.update({
                totalEarned: admin.firestore.FieldValue.increment(interest),
              });

              // Reduce card's reserved amount
              await db
                .collection("users")
                .doc(userId)
                .collection("cards")
                .doc(txn.cardId)
                .update({
                  reserved: admin.firestore.FieldValue.increment(-txn.amount),
                });

              totalEarningsToday += interest;

              functions.logger.info(
                `Redeemed ${txnId}: amount ${txn.amount}, interest ${interest}`
              );
            } catch (apiError) {
              functions.logger.error(
                `Bank API error redeeming ${txnId}:`,
                apiError.message
              );
              // Continue with next transaction even if one fails
            }
          }

          // Send push notification if user earned money today
          if (totalEarningsToday > 0) {
            try {
              // Get user's FCM token (if exists)
              const userProfileDoc = await db
                .collection("users")
                .doc(userId)
                .collection("profile")
                .doc("data")
                .get();

              const fcmToken = userProfileDoc.data()?.fcmToken;

              if (fcmToken) {
                const message = {
                  token: fcmToken,
                  notification: {
                    title: "Overnight Earnings Returned! 💰",
                    body: `You earned $${totalEarningsToday.toFixed(
                      2
                    )} overnight!`,
                  },
                  data: {
                    type: "overnight_return",
                    amount: totalEarningsToday.toString(),
                    timestamp: Date.now().toString(),
                  },
                  android: {
                    priority: "high",
                    notification: {
                      sound: "default",
                      clickAction: "FLUTTER_NOTIFICATION_CLICK",
                    },
                  },
                  apns: {
                    payload: {
                      aps: {
                        sound: "default",
                        badge: 1,
                      },
                    },
                  },
                };

                await admin.messaging().send(message);

                functions.logger.info(
                  `Sent push notification to user ${userId}: $${totalEarningsToday.toFixed(
                    2
                  )}`
                );
              } else {
                functions.logger.info(
                  `No FCM token for user ${userId}, skipping notification`
                );
              }
            } catch (notificationError) {
              functions.logger.error(
                `Error sending notification to ${userId}:`,
                notificationError.message
              );
              // Continue even if notification fails
            }
          }
        } catch (userError) {
          functions.logger.error(
            `Error processing redemption for user ${userId}:`,
            userError.message
          );
          // Continue with next user even if one fails
        }
      }

      functions.logger.info("Overnight redemption completed successfully");
      return {success: true, message: "Overnight redemption completed"};
    } catch (error) {
      functions.logger.error("Fatal error in redeemOvernight:", error);
      throw error;
    }
  }
);

/**
 * Optional: HTTP-triggered function for manual testing
 * Call this to test overnight scheduling without waiting for the schedule
 */
exports.testScheduleOvernight = require("firebase-functions").https.onRequest(
  async (req, res) => {
    try {
      // Manually trigger the schedule logic
      const result = await exports.scheduleOvernight.run();
      res.json({success: true, result});
    } catch (error) {
      res.status(500).json({success: false, error: error.message});
    }
  }
);

/**
 * Optional: HTTP-triggered function for manual testing
 * Call this to test overnight redemption without waiting for the schedule
 */
exports.testRedeemOvernight = require("firebase-functions").https.onRequest(
  async (req, res) => {
    try {
      // Manually trigger the redeem logic
      const result = await exports.redeemOvernight.run();
      res.json({success: true, result});
    } catch (error) {
      res.status(500).json({success: false, error: error.message});
    }
  }
);

/**
 * Callable Cloud Function: Create Stripe Checkout Session
 * 
 * Creates a Stripe checkout session for premium subscription
 * 
 * Parameters:
 * @param {string} priceId - Stripe price ID (monthly or yearly)
 * 
 * Returns:
 * @param {string} sessionId - Stripe checkout session ID for redirect
 * 
 * Usage from client:
 * const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
 * const { data } = await createCheckoutSession({ priceId: 'price_xxx' });
 * redirectToCheckout(data.sessionId);
 */
exports.createCheckoutSession = onCall(async (request) => {
  const functions = require("firebase-functions");

  // Check if user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to create checkout session"
    );
  }

  const userId = request.auth.uid;
  const {priceId} = request.data;

  if (!priceId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Price ID is required"
    );
  }

  try {
    // Initialize Stripe with secret key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Stripe is not configured on the server"
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get user email from Firebase Auth
    const userRecord = await admin.auth().getUser(userId);
    const userEmail = userRecord.email;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${process.env.APP_URL || "http://localhost:5000"}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || "http://localhost:5000"}/dashboard`,
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    });

    functions.logger.info(
      `Created checkout session ${session.id} for user ${userId}`
    );

    return {
      sessionId: session.id,
    };
  } catch (error) {
    functions.logger.error("Error creating checkout session:", error);
    throw new functions.https.HttpsError(
      "internal",
      `Failed to create checkout session: ${error.message}`
    );
  }
});
