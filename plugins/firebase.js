import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/compat";
import "firebase/auth";
import * as firebaseui from 'firebaseui'
import { getFirestore } from 'firebase/firestore'

export default function (nuxtApp) {

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: nuxtApp.$config.firebaseApiKey,
    authDomain: "kadai-kanri.firebaseapp.com",
    projectId: "kadai-kanri",
    storageBucket: "kadai-kanri.appspot.com",
    messagingSenderId: "599254513914",
    appId: "1:599254513914:web:6154e2e348a6cae92a7143"
  };
// Initialize Firebase


  const app = firebase.initializeApp(firebaseConfig);
  getFirestore(app)
}
