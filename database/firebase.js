import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAlAlHHkZZEvABvxWH7idmBUZHWdYcuawA",
    authDomain: "techsmiths-blog.firebaseapp.com",
    projectId: "techsmiths-blog",
    storageBucket: "techsmiths-blog.appspot.com",
    messagingSenderId: "696521916072",
    appId: "1:696521916072:web:69f665d74d618c530dcc9d",
    measurementId: "G-EDGFEW7H99"
};

// Initialize Firebase

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { firebaseConfig, app }