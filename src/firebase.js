// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  //logInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_3mM7Ql7go6JtD59fxFUQR94HLxYU38w",
  authDomain: "beautysalonapp-31438.firebaseapp.com",
  databaseURL: "gs://beautysalonapp-31438.appspot.com",
  projectId: "beautysalonapp-31438",
  storageBucket: "beautysalonapp-31438.appspot.com",
  messagingSenderId: "1014802981494",
  appId: "1:1014802981494:web:b919b07ca4a4ed55bf7557",
  measurementId: "G-6QH43XHYYX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const auth = getAuth(app);

const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const createSalonInDB = async (salon) => {
  try {
    console.log(db);
    await addDoc(collection(db, "salons"), salon);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const uploadFiles = (files) => {
  const imageUuids = [];
  for (let i = 0; i < files.length; i++) {
    let currUuid = uuidv4();
    imageUuids.push(currUuid);
    const storageRef = ref(storage, currUuid);
    uploadBytes(storageRef, files[i]).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      console.log(snapshot);
    });
  }
  return imageUuids;
};
const getAllSalons = async () => {
  return await getDocs(collection(db, "salons"));
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  createSalonInDB,
  storage,
  uploadFiles,
  getAllSalons,
};
