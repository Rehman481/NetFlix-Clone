import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";

import { toast } from "react-toastify";

// Firebase Config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// ======================
// SIGNUP
// ======================
export const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: res.user
    };
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "));

    return {
      success: false,
      message: error.message
    };
  }
};

// ======================
// LOGIN (UPDATED WITH REMEMBER ME)
// ======================
export const login = async (email, password, rememberMe) => {
  try {
    // 🔥 THIS is the Remember Me fix
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

    const res = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: res.user
    };
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "));

    return {
      success: false,
      
    };
  }
};

// ======================
// LOGOUT
// ======================
export const logout = async () => {
  try {
    await signOut(auth);

    return {
      success: true
    };
  } catch (error) {
    toast.error(error.message);

    return {
      success: false,
      
    };
  }
};