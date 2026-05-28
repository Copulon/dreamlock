import { app }
from "./firebase-config.js";

import { sendTelegramMessage }
from "./telegram.js";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db =
  getFirestore(app);

async function checkReminders() {

  const snapshot =
    await getDocs(
      collection(db, "goals")
    );

  const now =
    new Date();

  snapshot.forEach(
    async (goal) => {

      const data =
        goal.data();

      // =====================
      // PAYMENT TYPE
      // =====================

      const paymentType =
        data.paymentType || "monthly";

      // =====================
      // LAST PAYMENT
      // =====================

      const lastPayment =
        data.lastPaymentDate
        ?
        new Date(
          data.lastPaymentDate
        )
        :
        new Date();

      // =====================
      // NEXT DUE DATE
      // =====================

      let nextDue =
        new Date(lastPayment);

      if (
        paymentType ===
        "weekly"
      ) {

        nextDue.setDate(
          nextDue.getDate() + 7
        );

      }

      else if (
        paymentType ===
        "biweekly"
      ) {

        nextDue.setDate(
          nextDue.getDate() + 14
        );

      }

      else {

        nextDue.setMonth(
          nextDue.getMonth() + 1
        );

      }

      // =====================
      // DAY DIFFERENCE
      // =====================

      const diffTime =
        nextDue - now;

      const diffDays =
Math.floor(
  diffTime /
  (1000 * 60 * 60 * 24)
);

      // =====================
      // MESSAGE
      // =====================

      let message = "";
      message = `
🔥 TEST REMINDER DREAMLOCK

Goals:
${data.name}

Kalau pesan ini masuk,
berarti reminder engine berhasil 😭🔥
`;

      // H-3
      if (diffDays <= 3) {

        message = `⏳ DreamLock Reminder

Goals:
${data.name}

Tagihan akan jatuh tempo
3 hari lagi 😭

Jangan sampai telat bayar.`;

      }

      // HARI INI
      else if (
        diffDays <= 0
      ) {

        message = `🚨 DreamLock Deadline

Goals:
${data.name}

Hari ini adalah
jatuh tempo pembayaran 😭`;

      }

      // TELAT
      else if (
        diffDays < 0
      ) {

        message = `🔴 DreamLock Warning

Goals:
${data.name}

Kamu telat bayar 😭

Segera setor sebelum
KOL memburuk.`;

        await updateDoc(
          goal.ref,
          {
            paymentStatus:
              "TELAT BAYAR",

            kol:
              "KOL 3 🔴"
          }
        );

      }

      // =====================
      // SEND TELEGRAM
      // =====================

      if (message !== "") {

        await sendTelegramMessage(
          message
        );

      }

    }
  );

}

checkReminders();