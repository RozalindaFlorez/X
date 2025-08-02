// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4QpoOW7n-9iNEBHv4r7QhmR7c8FtXuSo",
  authDomain: "x-veritas-collegiate-c92a8.firebaseapp.com",
  projectId: "x-veritas-collegiate-c92a8",
  storageBucket: "x-veritas-collegiate-c92a8.appspot.com",
  messagingSenderId: "36746537246",
  appId: "1:36746537246:web:2339cc13387ad88ae0c10f",
  measurementId: "G-EP2XLZ1BEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Example: Sign in function
async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
    // Redirect or update UI here
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      console.log('Incorrect password');
    } else if (error.code === 'auth/user-not-found') {
      console.log('User not found');
    } else {
      console.log('Error:', error.message);
    }
  }
}
