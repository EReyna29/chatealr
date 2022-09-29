// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXVqMzIMLaXlpXfnXMwcg_YY3X9Oa4SOw",
    authDomain: "chat-80e9e.firebaseapp.com",
    projectId: "chat-80e9e",
    storageBucket: "chat-80e9e.appspot.com",
    messagingSenderId: "171939935429",
    appId: "1:171939935429:web:b18a68afd35390e62a6cac"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();