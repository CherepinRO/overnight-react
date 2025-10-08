import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Check if Firebase is properly configured
const isFirebaseConfigured = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

let app: any = null;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

const provider = new GoogleAuthProvider();

interface UserProfile {
  premium: boolean;
  limit: number;
  totalEarned: number;
}

export async function signInWithGoogle(): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add Firebase credentials to your environment.');
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Get ID token and store in localStorage
    const idToken = await user.getIdToken();
    localStorage.setItem('idToken', idToken);
    
    // Create or update Firestore user profile
    const userRef = doc(db, 'users', user.uid, 'profile', 'data');
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const profile: UserProfile = {
        premium: false,
        limit: 100000,
        totalEarned: 0
      };
      await setDoc(userRef, profile);
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured) {
    localStorage.removeItem('idToken');
    return;
  }

  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('idToken');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured || !auth) {
    // Call callback with null if Firebase is not configured
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured) {
    return null;
  }

  try {
    const userRef = doc(db, 'users', uid, 'profile', 'data');
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}
