// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1QCArHCPCh_xfFyLPV5iXGGsKMpFeN1Q",
  authDomain: "cornell-health-2024.firebaseapp.com",
  projectId: "cornell-health-2024",
  storageBucket: "cornell-health-2024.appspot.com",
  messagingSenderId: "487627579899",
  appId: "1:487627579899:web:7986286bcc89f472b66b5e",
  measurementId: "G-QMWCBYCD72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);