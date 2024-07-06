// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore from firebase/firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOxsa-8qbSPLuoZqjKbZ1n38RCR0RFvcg",
  authDomain: "stageapplication-7f5a5.firebaseapp.com",
  projectId: "stageapplication-7f5a5",
  storageBucket: "stageapplication-7f5a5.appspot.com",
  messagingSenderId: "8209082356",
  appId: "1:8209082356:web:6381dd7f2a16327af93ba1",
  measurementId: "G-M46FDH617E"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Correctly initialize Firestore
const analytics = getAnalytics(app);

export { firestore };
