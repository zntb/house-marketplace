// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'house-marketplace-f6cc8.firebaseapp.com',
  projectId: 'house-marketplace-f6cc8',
  storageBucket: 'house-marketplace-f6cc8.appspot.com',
  messagingSenderId: '80838074061',
  appId: '1:80838074061:web:a863af77245727ca2b5384',
};

// Initialize Firebase

initializeApp(firebaseConfig);
export const db = getFirestore();
