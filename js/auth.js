import { app } from "./firebase-config.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const message = document.getElementById("message");

registerBtn.addEventListener("click", async () => {

  try {

    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    message.innerText = "Register berhasil 😭";

  } catch (error) {

    message.innerText = error.message;

  }

});

loginBtn.addEventListener("click", async () => {

  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    message.innerText = "Login berhasil 😭";

    window.location.href = "dashboard.html";

  } catch (error) {

    message.innerText = error.message;

  }

});