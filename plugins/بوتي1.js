import fetch from "node-fetch";

let handler = async (m, { conn }) => {
  let name = conn.getName(m.sender);

  // 💬 الرد العشوائي
  let teks = `
${pickRandom([`*بـحـبـك بـابـا 🥹*`])}
`.trim();

  // 📜 إنشاء رسالة التوثيق
  const thumb = await (await fetch('https://files.catbox.moe/80dv0b.jpg')).buffer(); // الصورة نفسها المستخدمة
  const verifiedMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "HULK_VERIFIED"
    },
    message: {
      locationMessage: {
        name: "ιтαcнι вσт🥹",
        jpegThumbnail: thumb,
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;𝐇𝐔𝐋𝐊 𝐁𝐎𝐓;;;
FN:𝐇𝐔𝐋𝐊 𝐁𝐎𝐓
ORG:HULK SYSTEM
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:HULK SUPPORT
X-WA-BIZ-DESCRIPTION:Official HULK Bot Verified Service
X-WA-BIZ-NAME:ιтαcнι вσт
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  // 📩 إرسال الرد مع التوثيق
  conn.reply(m.chat, teks, verifiedMessage, { mentions: { mentionedJid: [m.sender] } });
};

handler.customPrefix = /(بوتي)/i;
handler.command = new RegExp;
handler.rowner = true;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}