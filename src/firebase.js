import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoxy-lx2GrDXw1lCQ-P5ouvJ7Kp_SblDQ",
  authDomain: "ebus-system-4e59d.firebaseapp.com",
  projectId: "ebus-system-4e59d",
  storageBucket: "ebus-system-4e59d.firebasestorage.app",
  messagingSenderId: "132697298261",
  appId: "1:132697298261:web:e62c49965dc551fa3c0bdc",
  measurementId: "G-FTEHEJ21ZW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;

