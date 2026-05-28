// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firebase config
const firebaseConfig =  {
    apiKey: "AIzaSyCTVnTjOjgnH5shB9UeXh9tJ0CmqxgTLTo",
    authDomain: "dreamlock-b1cb5.firebaseapp.com",
    projectId: "dreamlock-b1cb5",
    storageBucket: "dreamlock-b1cb5.firebasestorage.app",
    messagingSenderId: "213951987193",
    appId: "1:213951987193:web:ceca3390bf56f9f16b5128"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };