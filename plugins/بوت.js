import { prepareWAMessageMedia, generateWAMessageFromContent } from "@whiskeysockets/baileys";

const handler = async (m, { conn }) => {
    const imageUrl = "https://files.catbox.moe/57nt4f.jpg"; // رابط الصورة المصغرة
    const link1 = "https://wa.me/213551217759"; // الرابط الأول (اتصال مع المطور)
    const link2 = "https://whatsapp.com/channel/0029VbCBbYA5q08hEVYjXD2f"; // الرابط الثاني (القناة)

    // تجهيز الصورة المصغرة
    const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: conn.waUploadToServer }
    );

    // إنشاء الرسالة التفاعلية
    const interactiveMessage = {
        body: { text: "*مـرًحـبا بـك فـي عـالـمـنـا مـعـك  〘  𝙰𝚁𝚃𝙷𝚄𝚁 〙*" },
        footer: { text: "𝙰𝚁𝚃_𝙱𝙾𝚃" },
        header: { 
            title: "❪🩸┇𝙰𝚁𝚃_𝙱𝙾𝚃┇⚡❫", 
            hasMediaAttachment: true, 
            imageMessage: media.imageMessage 
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "｢🩸┊لـلـمـطـور┊🩸｣",
                        url: link1
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "｢🪶┊القناة┊🪶｣",
                        url: link2
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "〘 قـائـمـه 𝙰𝚁𝚃𝙷𝚄𝚁 〙",
                        id: ".اوامر"
                    })
                }
            ]
        }
    };

    // إرسال الرسالة
    let msg = generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message: { interactiveMessage } } },
        { userJid: conn.user.jid, quoted: m }
    );

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = /^بوت$/i; // تشغيل الكود عند كتابة ".بوت"

export default handler;