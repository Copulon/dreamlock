import { app } from "./firebase-config.js";

import {
  getFirestore,
  collection,
  updateDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { sendTelegramMessage }
from "./telegram.js";

const db = getFirestore(app);

export async function checkReminders() {

  const snapshot =
    await getDocs(
      collection(db, "goals")
    );

  snapshot.forEach(async (doc) => {

    const data = doc.data();

    // =========================
    // RESET TAGIHAN BULANAN
    // =========================

    const now =
      new Date();

    const currentMonth =
      now.getMonth();

    const lastResetMonth =
      data.lastResetMonth ?? -1;

    if (
      currentMonth !==
      lastResetMonth
    ) {

      await updateDoc(doc.ref, {

        paymentStatus:
          "BELUM BAYAR",

        lastResetMonth:
          currentMonth

      });

    }

    // =========================
    // PAYMENT TYPE
    // =========================

    const dueDate =
      Number(data.dueDate || 1);

    const paymentType =
      data.paymentType ||
      "monthly";

    const todayDate =
      new Date();

    const today =
      todayDate.getDate();

    const currentDay =
      todayDate.getDay();

    let diff = 0;

    // WEEKLY
    if (
      paymentType ===
      "weekly"
    ) {

      diff =
        dueDate - currentDay;

    }

    // BIWEEKLY
    else if (
      paymentType ===
      "biweekly"
    ) {

      diff =
        dueDate - today;

      if (diff <= -14) {

        diff = 0;

      }

    }

    // MONTHLY
    else {

      diff =
        dueDate - today;

    }

    // =========================
    // KOL SYSTEM
    // =========================

    let kol =
      "KOL 3 🔴";

    if (
      data.goalStatus ===
      "LUNAS"
    ) {

      kol =
        "KOL 1 🟢";

    }

    else if (
      data.paymentStatus ===
      "SUDAH DIBAYAR"
    ) {

      kol =
        "KOL 2 🟡";

    }

    await updateDoc(doc.ref, {
      kol: kol
    });

    // =========================
    // REMINDER SYSTEM
    // =========================

    if (
      data.paymentStatus ===
      "SUDAH DIBAYAR"
    ) {
      return;
    }

    let reminderMessage = "";

    // H-2
    if (diff === 2) {

      reminderMessage =
`🟡 DREAMLOCK REMINDER

Goals:
${data.name}

Tagihan akan jatuh tempo
2 hari lagi 😭`;

    }

    // HARI H
    else if (diff === 0) {

      reminderMessage =
`🔴 DREAMLOCK DEADLINE

Goals:
${data.name}

Hari ini adalah batas pembayaran 😭`;

    }

    // TELAT
    else if (diff < 0) {

      reminderMessage =
`⚫ DREAMLOCK OVERDUE

Goals:
${data.name}

Kamu melewati jatuh tempo 😭`;

      await updateDoc(doc.ref, {

        kol:
          "KOL 3 🔴"

      });

    }

    // =========================
    // KIRIM TELEGRAM
    // =========================

    if (
      reminderMessage !== ""
    ) {

      await sendTelegramMessage(
        reminderMessage
      );

    }

  });

}