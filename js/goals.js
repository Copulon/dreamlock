import { app } from "./firebase-config.js";

import { sendTelegramMessage }
from "./telegram.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  deleteDoc,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth =
  getAuth(app);

const db =
  getFirestore(app);

const paymentType =
document.getElementById(
  "paymentType"
);

const goalName =
document.getElementById(
  "goalName"
);

const goalTarget =
document.getElementById(
  "goalTarget"
);

const monthlyBill =
document.getElementById(
  "monthlyBill"
);

const dueDate =
document.getElementById(
  "dueDate"
);

const saveGoalBtn =
document.getElementById(
  "saveGoalBtn"
);

const goalsContainer =
document.getElementById(
  "goalsContainer"
);

const backBtn =
document.getElementById(
  "backBtn"
);

// =========================
// BACK BUTTON
// =========================

backBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "dashboard.html";

  }
);

// =========================
// AUTH CHECK
// =========================

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      loadGoals(user.uid);

      saveGoalBtn.addEventListener(
        "click",
        async () => {

          if (
            goalName.value === "" ||
            goalTarget.value === ""
          ) {
            return;
          }

          await addDoc(
            collection(db, "goals"),
            {

              uid:
                user.uid,

              name:
                goalName.value,

              target:
                Number(
  goalTarget.value
  .replace(/\./g, "")
),

              monthlyBill:
              Number(
  monthlyBill.value
  .replace(/\./g, "")
),

              dueDate:
                Number(
                  dueDate.value
                ),

              paymentType:
                paymentType.value,

              saved: 0,

              paymentStatus:
                "BELUM BAYAR",

              goalStatus:
                "BELUM LUNAS",

              kol:
                "KOL 3 🔴",

              createdAt:
                Date.now(),

              lastPaymentDate:
                Date.now()

            }
          );

          goalName.value = "";
          goalTarget.value = "";
          monthlyBill.value = "";
          dueDate.value = "";

          loadGoals(user.uid);

        }
      );

    }

    else {

      window.location.href =
        "login.html";

    }

  }
);

// =========================
// LOAD GOALS
// =========================

async function loadGoals(uid) {

  goalsContainer.innerHTML =
    "";

  const querySnapshot =
    await getDocs(
      collection(db, "goals")
    );

  querySnapshot.forEach(
    (docItem) => {

      const data =
        docItem.data();

      if (
        data.uid === uid
      ) {

        goalsContainer.innerHTML += `

        <div class="
          goal-card
          ${getKolClass(data.kol)}
        ">

          <div class="goal-top">

            <div>

              <h2>
                ${data.name}
              </h2>

              <p>
                Target:
                Rp${Number(
                  data.target
                ).toLocaleString(
                  "id-ID"
                )}
              </p>

            </div>

            <div class="
              status-badge
            ">
              ${data.kol || "KOL 3 🔴"}
            </div>

          </div>

          <div class="
            money-section
          ">

            <h1>

              Rp${Number(
                data.saved
              ).toLocaleString(
                "id-ID"
              )}

            </h1>

            <span>
              terkumpul
            </span>

          </div>

          <div class="
            progress-wrapper
          ">

            <div class="
              progress-top
            ">

              <span>
                Progress
              </span>

              <span>

                ${Math.floor(
                  (
                    data.saved /
                    data.target
                  ) * 100
                )}%

              </span>

            </div>

            <div class="
              progress-bar
            ">

              <div
                class="
                progress-fill
                "

                style="
                width:
                ${
                  (
                    data.saved /
                    data.target
                  ) * 100
                }%;
                "

              ></div>

            </div>

          </div>

          <div class="
            status-row
          ">

            <div class="
              status-badge
            ">
              ${data.paymentStatus}
            </div>

            <div class="
              status-badge
            ">
              ${data.paymentType}
            </div>

            <div class="
              status-badge
            ">
              ${data.goalStatus}
            </div>

          </div>

          <p>

            Tagihan:
            Rp${Number(
              data.monthlyBill
            ).toLocaleString(
              "id-ID"
            )}

          </p>

          ${
            data.paymentType ===
            "monthly"

            ?

            `
            <p>
              Jatuh Tempo:
              Tanggal
              ${data.dueDate}
            </p>
            `

            :

            ""
          }

          <input
            type="number"

            id="deposit-${docItem.id}"

            placeholder="
            Nominal setor
            "
          />

          <div class="
            button-group
          ">

            <button

              onclick="
                depositMoney(
                  '${docItem.id}',
                  ${data.saved}
                )
              "

            >
              Setor
            </button>

            <button

              class="delete-btn"

              onclick="
                deleteGoal(
                  '${docItem.id}'
                )
              "

            >
              Hapus
            </button>

          </div>

        </div>

        `;

      }

    }
  );

}

// =========================
// DEPOSIT
// =========================

window.depositMoney =
async function (
  docId,
  currentSaved
) {

  const input =
    document.getElementById(
      `deposit-${docId}`
    );

  const amount =
    Number(input.value);

  if (
    !amount ||
    amount <= 0
  ) {
    return;
  }

  const goalRef =
    doc(
      db,
      "goals",
      docId
    );

  const newSaved =
    currentSaved + amount;

  let paymentStatus =
    "BELUM BAYAR";

  let goalStatus =
    "BELUM LUNAS";

  let kol =
    "KOL 3 🔴";

  let monthlyBill = 0;
  let targetGoal = 0;
  let goalName = "";

  const querySnapshot =
    await getDocs(
      collection(db, "goals")
    );

  querySnapshot.forEach(
    (goal) => {

      if (
        goal.id === docId
      ) {

        const data =
          goal.data();

        monthlyBill =
          Number(
            data.monthlyBill || 0
          );

        targetGoal =
          Number(
            data.target || 0
          );

        goalName =
          data.name || "";

      }

    }
  );

  // PAYMENT STATUS

  if (
    amount >= monthlyBill
  ) {

    paymentStatus =
      "SUDAH DIBAYAR";

  }

  // GOAL STATUS

  if (
    newSaved >= targetGoal
  ) {

    goalStatus =
      "LUNAS";

  }

  // KOL SYSTEM

  if (
    goalStatus ===
    "LUNAS"
  ) {

    kol =
      "KOL 1 🟢";

  }

  else if (
    paymentStatus ===
    "SUDAH DIBAYAR"
  ) {

    kol =
      "KOL 2 🟡";

  }

  // UPDATE DATABASE

  await updateDoc(
    goalRef,
    {

      saved:
        newSaved,

      paymentStatus:
        paymentStatus,

      goalStatus:
        goalStatus,

      kol:
        kol,

      lastPaymentDate:
        Date.now()

    }
  );

  // TELEGRAM

  await sendTelegramMessage(

`💰 DreamLock Update

Goals:
${goalName}

Setor:
Rp${amount.toLocaleString("id-ID")}

Status Tagihan:
${paymentStatus}

Status Goals:
${goalStatus}

KOL:
${kol}`

  );

  location.reload();

};

// =========================
// KOL CLASS
// =========================

window.getKolClass =
function(kol) {

  if (!kol) return "";

  if (
    kol.includes("KOL 1")
  ) {

    return "kol1-card";

  }

  if (
    kol.includes("KOL 2")
  ) {

    return "kol2-card";

  }

  if (
    kol.includes("KOL 3")
  ) {

    return "kol3-card";

  }

  return "kol4-card";

};

// =========================
// DELETE GOAL
// =========================

window.deleteGoal =
async function (
  docId
) {

  const confirmDelete =
    confirm(
      "Yakin mau hapus goals ini? 😭"
    );

  if (!confirmDelete) {
    return;
  }

  await deleteDoc(
    doc(
      db,
      "goals",
      docId
    )
  );

  location.reload();

};


function formatInputRupiah(input) {

  input.addEventListener(
    "input",
    (e) => {

      let angka =
        e.target.value
        .replace(/\D/g, "");

      if (!angka) {

        e.target.value = "";

        return;

      }

      e.target.value =
        Number(angka)
        .toLocaleString("id-ID");

    }
  );

}

formatInputRupiah(goalTarget);

formatInputRupiah(monthlyBill);
