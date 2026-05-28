import { app } from "./firebase-config.js";

import { checkReminders } from "./reminder.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const db = getFirestore(app);
const billAmount =
  document.getElementById("billAmount");

const dueDate =
  document.getElementById("dueDate");

const auth = getAuth(app);

const welcomeText = document.getElementById("welcomeText");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

  if (user) {

    welcomeText.innerText =
      `Halo, ${user.email} 👋`;
      
      checkReminders();
      loadBills(user.uid);

  } else {

    window.location.href = "login.html";

  }

});

setInterval(() => {

  checkReminders();

}, 1000 * 60 * 30); // tiap 1 jam

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});

async function loadBills(uid) {

  let totalBills = 0;

  const snapshot =
    await getDocs(
      collection(db, "goals")
    );

  snapshot.forEach((doc) => {

    const data = doc.data();

    if (data.uid === uid) {

      if (data.status !== "LUNAS") {

  totalBills +=
    Number(data.monthlyBill || 0);

    }
  }

  });

  billAmount.innerText =
    `Rp${totalBills.toLocaleString("id-ID")}`;

  dueDate.innerText =
    "Jatuh tempo: 25 tiap bulan 😭";

}