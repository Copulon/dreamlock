const token = "8624329418:AAHvaYVNJl8gBiR8o33uv6nX53eAAKD8FTE";
const chatId = "6123920577";

// =========================
// KIRIM PESAN
// =========================

export async function sendTelegramMessage(message) {

  const url =
    `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {

    method: "POST",

    headers: {
      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({

      chat_id:
        chatId,

      text:
        message

    })

  });

}

// =========================
// KIRIM FOTO
// =========================

export async function sendTelegramPhoto(
  file,
  caption = ""
) {

  const formData =
    new FormData();

  formData.append(
    "chat_id",
    chatId
  );

  formData.append(
    "photo",
    file
  );

  formData.append(
    "caption",
    caption
  );

  await fetch(

    `https://api.telegram.org/bot${token}/sendPhoto`,

    {
      method: "POST",
      body: formData
    }

  );

}
