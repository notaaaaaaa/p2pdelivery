import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDF9ahPY3TiqZM166axFyeNHF5lqsCcuf4",
  authDomain: "app1-24456.firebaseapp.com",
  projectId: "app1-24456",
  storageBucket: "app1-24456.appspot.com",
  messagingSenderId: "903705980260",
  appId: "1:903705980260:web:c74f3c60be8a20b46e9e71",
  measurementId: "G-CPWPN1KC01",
};

let app;
let auth;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
    } else {
      console.log("No user is signed in.");
    }
  });
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { app, auth, analytics };
