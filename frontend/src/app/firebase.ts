// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBranS6F76fInzopeaYMg0ATmW5JUA_QgI",
    authDomain: "geekhackathon-vol5.firebaseapp.com",
    projectId: "geekhackathon-vol5",
    storageBucket: "geekhackathon-vol5.appspot.com",
    messagingSenderId: "461221503183",
    appId: "1:461221503183:web:81cdf946d2106a70ea57ba",
    measurementId: "G-RKTXMW4QBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);