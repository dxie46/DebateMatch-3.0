// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4aW2vK9-0J11z2W3GBRq0C_Phfk7aBD8",
  authDomain: "debatematch-3.firebaseapp.com",
  projectId: "debatematch-3",
  storageBucket: "debatematch-3.appspot.com",
  messagingSenderId: "293229456877",
  appId: "1:293229456877:web:c46c4bad54d1fd63a28be4",
  measurementId: "G-3Y5PNS93B8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getFirestore(app);