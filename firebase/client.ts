import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDZLtjs0RAFL2B8wz4UAEXOAZn8KwBTHkU",
  authDomain: "intpre.firebaseapp.com",
  projectId: "intpre",
  storageBucket: "intpre.firebasestorage.app",
  messagingSenderId: "295722815531",
  appId: "1:295722815531:web:fa3d84cacf30407ae11a6e",
  measurementId: "G-7E20DW0HBT",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
