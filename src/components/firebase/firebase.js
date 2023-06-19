import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_APP_apiKey,
//   authDomain: process.env.FIREBASE_APP_authDomain,
//   projectId: process.env.FIREBASE_APP_projectId,
//   storageBucket: process.env.FIREBASE_APP_storageBucket,
//   messagingSenderId: process.env.FIREBASE_APP_messagingSenderId,
//   appId: process.env.FIREBASE_APP_appId,
//   measurementId: process.env.FIREBASE_APP_measurementId
// };

const firebaseConfig = {
  apiKey: "AIzaSyAUUI3dEcn8dq_fN0JqhAml0m19BV1LTw4",
  authDomain: "commbit-b5e58.firebaseapp.com",
  projectId: "commbit-b5e58",
  storageBucket: "commbit-b5e58.appspot.com",
  messagingSenderId: "657953082262",
  appId: "1:657953082262:web:64c8e5a576f8b140772bb7",
  measurementId: "G-TJWE251G98"
};

// Initialize Firebase and Firebase Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize storage
const store = getStorage(app);

export { auth, db, store };