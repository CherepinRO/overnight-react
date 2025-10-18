# 🔥 Firebase Google Sign-In Setup Guide

Your Firebase API keys are configured, but Google sign-in requires additional setup in the Firebase Console.

## ✅ Step 1: Enable Google Sign-In

1. **Go to Firebase Console:** https://console.firebase.google.com/
2. **Select your project**
3. **Navigate to:** Authentication → Sign-in method
4. **Click** on "Google" provider
5. **Enable** the toggle
6. **Add a support email** (required by Google)
7. **Click "Save"**

## ✅ Step 2: Authorize Your Domain (CRITICAL!)

This is the most common reason sign-in fails!

1. **In Firebase Console:** Authentication → Settings → Authorized domains
2. **Click "Add domain"**
3. **Add your Replit URL:**
   - Copy the URL from your browser (looks like: `c9d5d746-be72-4a81-831a-ccdc359ce850-00-8d7faj5qv77u.picard.replit.dev`)
   - Or check the Webview URL in Replit
4. **Click "Add"**

### Important Notes:
- The domain format should be like: `your-project.replit.dev` or `your-workspace-id.picard.replit.dev`
- **Do NOT include** `https://` or `http://` - just the domain
- **Do NOT include** the path (e.g., `/onboarding`)
- You may need to add multiple domains if your Replit URL changes

## ✅ Step 3: Test Google Sign-In

1. **Refresh your app** in the browser
2. **Navigate to** the onboarding page
3. **Check the checkbox** to agree to terms
4. **Click "Sign in with Google"**
5. **Select your Google account** in the popup

## 🐛 Common Errors & Solutions

### Error: "This domain is not authorized"
**Solution:** Add your Replit URL to Authorized domains (see Step 2)

### Error: "Pop-up was blocked"
**Solution:** 
- Allow pop-ups for this site in your browser settings
- Click the icon in the address bar to allow pop-ups
- Try again

### Error: "Google sign-in is not enabled"
**Solution:** Enable Google provider in Firebase Console (see Step 1)

### Error: "Sign-in cancelled"
**Solution:** You closed the Google sign-in popup. Try again and complete the sign-in.

## 🔍 Verify Setup

### Check Firebase Console:
1. **Authentication → Sign-in method**
   - ✅ Google should show "Enabled"
   
2. **Authentication → Settings → Authorized domains**
   - ✅ Your Replit domain should be listed
   - ✅ `localhost` should be listed (for development)

### Check Browser Console:
1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Click "Sign in with Google"**
4. **Look for errors** - they will now show specific details

## 📝 After Deployment

When you deploy your app (publish to production):

1. **Get your production URL** (will be like: `your-app.replit.app`)
2. **Add it to Authorized domains** in Firebase Console
3. **Test sign-in** on the production URL

If you use a custom domain:
- Add the custom domain to Authorized domains as well

## 🎯 Current Status

✅ Firebase credentials configured (API key, Project ID, App ID)
⚠️ Needs: Google sign-in enabled + Replit domain authorized

## 🔗 Quick Links

- **Firebase Console:** https://console.firebase.google.com/
- **Authentication Settings:** Console → Your Project → Authentication → Settings
- **Sign-in Methods:** Console → Your Project → Authentication → Sign-in method

---

**Once you complete Steps 1 & 2, Google sign-in will work immediately!** 🚀

The error messages in the app will now tell you exactly what's wrong.
