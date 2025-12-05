import { prepareWAMessageMedia, generateWAMessageFromContent } from "@whiskeysockets/baileys";

const handler = async (m, { conn }) => {
    const coverImageUrl = 'https://files.catbox.moe/ziws8j.jpg'; // صورة الاشتراك

    const messa = await prepareWAMessageMedia(
        { image: { url: coverImageUrl } },
        { upload: conn.waUploadToServer }
    );

    const interactiveMessage = {
        body: { text: "✨ *𓆩 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃 ⌯ اختر نوع الاشتراك الذي تريده ⌯ 💎* ✨" },
        footer: { text: "𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃" },
        header: {
            title: "╭───⟢❲ 💖 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃 💖 ❳╰───⟢",
            hasMediaAttachment: true,
            imageMessage: messa.imageMessage,
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: "💎 القائمة الرئيسية",
                        sections: [
                            {
                                title: "🎀 هل تريد البوت في جروبك؟ 🎀",
                                rows: [
                                    {
                                        header: "🤖 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃 في جروبك",
                                        title: "📌 إضافة البوت لجروبك",
                                        description: "🔹 السعر:\n🌍 الدول: رقم وهمي\n💎 الاشتراك: دائم",
                                        id: ".اشتراك_جروب"
                                    }
                                ]
                            },
                            {
                                title: "🏰 هل تريد البوت لمملكتك؟ 🏰",
                                rows: [
                                    {
                                        header: "👑 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃 لمملكتك",
                                        title: "🏆 اشتراك للممالك",
                                        description: "🔹 السعر:\n🌍 باقي الدول: رقمين وهميين",
                                        id: ".اشتراك_مملكة"
                                    }
                                ]
                            },
                            {
                                title: "💻 هل تريد السكربت الخاص بالبوت؟ 💻",
                                rows: [
                                    {
                                        header: "🛠️ سكربت 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃",
                                        title: "🎯 شراء السكربت",
                                        description: "🔹 السعر:\n🌍 باقي الدول: 4 دولار",
                                        id: ".اشتراك_سكربت"
                                    }
                                ]
                            }
                        ]
                    })
                }
            ],
            messageParamsJson: ''
        }
    };

    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: { interactiveMessage },
        },
    }, { userJid: conn.user.jid, quoted: m });

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = /^(اشتراك|subscribe)$/i;

export default handler;