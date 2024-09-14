import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged} from 'firebase/auth';
import { getFirestore, Firestore } from "firebase/firestore";
import { useState, useEffect } from 'react';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (typeof window !== "undefined") {
  firebaseApp = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_FIREBASE_APPID,
    });

  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

export function useAuth() {
  const [user, setUser] = useState<Auth | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onAuthStateChanged(auth, () => {
      setUser(auth);
    });

    return () => unsubscribe();
  }, []);

  return user;
}

export { firebaseApp, auth, firestore };

