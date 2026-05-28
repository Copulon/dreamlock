export async function sendTelegramMessage(message) {

  const token = "8624329418:AAHvaYVNJl8gBiR8o33uv6nX53eAAKD8FTE";
  const chatId = "6123920577";

  const url =
    `https://api.telegram.org/bot${'8624329418:AAHvaYVNJl8gBiR8o33uv6nX53eAAKD8FTE'}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });

}