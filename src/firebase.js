// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_3mM7Ql7go6JtD59fxFUQR94HLxYU38w",
  authDomain: "beautysalonapp-31438.firebaseapp.com",
  projectId: "beautysalonapp-31438",
  storageBucket: "beautysalonapp-31438.appspot.com",
  messagingSenderId: "1014802981494",
  appId: "1:1014802981494:web:b919b07ca4a4ed55bf7557",
  measurementId: "G-6QH43XHYYX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log("User logged in");
    // ...
  } else {
    console.log("NOT LOGGED IN");
  }
});
