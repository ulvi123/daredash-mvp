import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth,getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-X8XJMMTWJ5"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


const auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions };
