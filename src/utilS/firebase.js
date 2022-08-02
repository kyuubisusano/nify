// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBpvnUZWV9OcZaJYMkEiA2ChUIgb9DnLk",
  authDomain: "nify-99f51.firebaseapp.com",
  databaseURL: "https://nify-99f51-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "nify-99f51",
  storageBucket: "nify-99f51.appspot.com",
  messagingSenderId: "1006943067951",
  appId: "1:1006943067951:web:da07f4ab4e2f18302f8bda",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db,auth,storage}