import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC6LbN4imJXDhVt3CvtpoBeEEKZFMZLN9s",
  authDomain: "fir-auth-73c3e.firebaseapp.com",
  projectId: "fir-auth-73c3e",
  storageBucket: "fir-auth-73c3e.appspot.com",
  messagingSenderId: "1067975517382",
  appId: "1:1067975517382:web:5c9bf73d03d7fdabeb63c7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db
}