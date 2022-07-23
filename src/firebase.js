// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
  getDoc,
  doc,
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
  const imageIds = [];

  for (let i = 0; i < files.length; i++) {
    let currId = uuidv4();
    const storageRef = ref(storage, `salonsImages/${currId}`);
    uploadBytes(storageRef, files[i]);
    imageIds.push(currId);
  }
  return imageIds;
};

const getImageUrls = (imageIds) => {
  const urlPromises = imageIds.map((id) =>
    getDownloadURL(ref(storage, `salonsImages/${id}`))
  );
  return Promise.all(urlPromises);
};
const getAllSalons = async () => {
  return await getDocs(collection(db, "salons"));
};

const getOneSalon = async (salonId) => {
  const docRef = doc(db, "salons", salonId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
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
  getImageUrls,
  getOneSalon,
};
