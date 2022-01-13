import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const firestore = firebase.firestore();

export const createUserDocument = async (user) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  console.log(userRef);

  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email } = user;
    console.log(user.email);

    try {
      await userRef.set({
        email,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log("Error in creating user", error);
    }
  }
};
