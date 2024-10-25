import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSU1iGtVV7GGjFVlhpcSv0VFW7hjKHDTA",
  authDomain: "megasport-group.firebaseapp.com",
  projectId: "megasport-group",
  storageBucket: "megasport-group.appspot.com",
  messagingSenderId: "914081108316",
  appId: "1:914081108316:web:f2f83555d7b046aa3a7199",
  measurementId: "G-N9BNNV02Z8",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Set auth persistence to 'local' to persist sessions across page reloads
setPersistence(auth, browserLocalPersistence);

export { auth, storage ,db};
