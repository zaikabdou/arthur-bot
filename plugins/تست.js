import fs from "fs";
import path from "path";

export default {
    name: "تست",
    description: "اختبار البوت",

    async run({ sock, message, reply }) {
        try {
            const sender = message.key.participant || message.key.remoteJid;
            const group = message.key.remoteJid;

            // vCard بسيط (وهمي)
            const vcard =
                "BEGIN:VCARD\n" +
                "VERSION:3.0\n" +
                "FN: 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃\n" +
                "ORG: 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃\n" +
                "TEL;type=CELL;waid=213540419314:+213 540419314\n" +
                "END:VCARD";

            // Fake quoted contact
            const fakeQuoted = {
                key: {
                    remoteJid: group,
                    fromMe: false,
                    participant: "0@s.whatsapp.net",
                    id: "FAKE_CONTACT_VCARD"
                },
                message: {
                    contactMessage: {
                        displayName: "𝑶𝑺𝑨𝑹𝑨𝑮𝑰 Bot",
                        vcard
                    }
                }
            };

            // الكتابة المزخرفة
            const fancyText = `
╭─❖ 『*𝙱𝚈 𝙰𝙱𝙳𝙾𝚄*』 ❖─╮
│
│ *»D𝐎𝐍'𝐓 𝐏𝑳𝐀𝐘 𝐖𝐈𝐓𝐇 𝙰𝚁𝚃 ｼ»*
│ *_𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑻𝑶 𝑯𝑬𝑳𝑳_*
│
╰────────────╯`;

            // صورة MIKEY
            const imagePath = path.join(process.cwd(), "resources", "OSARAGI.jpg");
            const hasImage = fs.existsSync(imagePath);
            const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

            // الرسالة
            const msg = {
                text: fancyText,
                contextInfo: {
                    externalAdReply: {
                        title: "☠️ 𝐎𝐒𝐀𝐑𝐀𝐆𝐈🍷",
                        body: "جرب اللعب؟ جهّز نفسك للجحيم 🔥",
                        mediaType: 1,
                        thumbnail: imageBuffer,
                        sourceUrl: "wa.me/213540419314?text=هلا+يا+حب+♥️",
                        showAdAttribution: true
                    }
                }
            };

            // الإرسال
            await sock.sendMessage(group, msg, { quoted: fakeQuoted });

        } catch (err) {
            reply(`⚠️ حدث خطأ: ${err.message}`);
        }
    }
};