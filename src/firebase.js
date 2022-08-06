// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import {
  getAuth,

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
  updateDoc,
  arrayUnion,
  arrayRemove,
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

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    let errMessage = err.message;
    let errCode = err.code;

    console.log("err message" + errMessage);
    console.log("err code" + errCode);

    if (errCode == "auth/wrong-password") {
      errMessage = "Invalid email or password.";
    } else if (errCode == "auth/user-not-found") {
      errMessage = "Invalid email or password.";
    } else if (errCode == "auth/network-request-failed") {
      errMessage =
        "Error connecting to the server. Please check your network connection and try again.";
    }

    return errMessage;
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
    let errMessage = err.message;
    let errCode = err.code;

    if (errCode == "auth/email-already-in-use") {
      errMessage = "The email already exist.";
    } else if (errCode == "auth/user-not-found") {
      errMessage = "Invalid email or password.";
    } else if (errCode == "auth/network-request-failed") {
      errMessage =
        "Error connecting to the server. Please check your network connection and try again.";
    }

    return errMessage;
  }
};

const logout = () => {
  signOut(auth);
};

const createSalonInDB = async (salon) => {
  try {
    console.log("INSIDE CREATE SALON");
    await addDoc(collection(db, "salons"), salon);
    console.log("inside create salon");
  } catch (err) {
    console.log("CATCHING ERR");
    console.log(err);
    let errMessage = err.message;
    let errCode = err.code;

    if (errCode == "auth/network-request-failed") {
      errMessage =
        "Error connecting to the server. Please check your network connection and try again.";
    }
    return errMessage;
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
  const res = await getDoc(docRef);

  if (res.exists()) {
    return res.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const editSalonInDB = async (salonId, salonData) => {
  const docRef = doc(db, "salons", salonId);
  const res = await getDoc(docRef);

  if (res.exists()) {
    await updateDoc(docRef, salonData);
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const addNewServiceInDB = async (salonId, service) => {
  const docRef = doc(db, "salons", salonId);
  await updateDoc(docRef, {
    services: arrayUnion(service),
  });
};

const deleteServiceInDB = async (salonId, service) => {
  const docRef = doc(db, "salons", salonId);

  await updateDoc(docRef, {
    services: arrayRemove(service),
  });
};

const createBookingInDB = async (booking) => {
  try {
    console.log(db);
    await addDoc(collection(db, "bookings"), booking);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getSalonBookings = async (salonId, service) => {
  const salonBookinfRef = collection(db, "bookings");

  const q = query(
    salonBookinfRef,
    where("salonId", "==", salonId),
    where("service", "==", service.service)
  );
  const salonBookings = await getDocs(q);
  const result = [];
  salonBookings.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  createSalonInDB,
  storage,
  uploadFiles,
  getAllSalons,
  getImageUrls,
  getOneSalon,
  editSalonInDB,
  addNewServiceInDB,
  deleteServiceInDB,
  createBookingInDB,
  getSalonBookings,
};
