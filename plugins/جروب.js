import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
    // التحقق من أن المستخدم مشرف أو مالك
    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, '*هذا الأمر مخصص للمشرفين فقط ❗*', m);
    }

    // إذا كان المستخدم ضغط زر "قفل" أو "فتح"
    if (args[0] === 'قفل' || args[0] === 'فتح') {
        let isClose = {
            'فتح': 'not_announcement',
            'قفل': 'announcement',
        }[args[0];

        try {
            await conn.groupSettingUpdate(m.chat, isClose);
            return conn.reply(
                m.chat,
                isClose === 'announcement'
                    ? 'تـم قـفـل الـمـجـمَـوعه بـنـجـاح 🌸'
                    : 'تـم فـتـح الـجروب بـواسـطة الادمـن 🌿',
                m
            );
        } catch (e) {
            console.error(e);
            return conn.reply(m.chat, '⚠️ حدث خطأ أثناء تعديل إعدادات المجموعة!', m);
        }
    }

    // في حالة لم يتم تحديد "قفل" أو "فتح" → نرسل الأزرار
    try {
        const thumbnail = await prepareWAMessageMedia(
            { image: { url: "https://files.catbox.moe/o8mvb6.jpg" } },
            { upload: conn.waUploadToServer }
        );

        const dataMessage = `🍁 مـرحـبا بـك يا حـبـيـبـي الادمـن تـحـكم فـي مـجـمَوعـتك مـع 𝙰𝚁𝚃_𝙱𝙾𝚃 ⚡`;

        let buttons = [
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '⌈🔒╎قفل المجموعه╎🔒⌋',
                    id: `${usedPrefix}جروب قفل`
                })
            },
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '⌈🔓╎فتح  المجموعه╎🔓⌋'  ,
                    id: `${usedPrefix}جروب فتح`
                })
            }
        ];

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: dataMessage },
                        footer: { text: '𝙰𝚁𝚃_𝙱𝙾𝚃' },
                        header: {
                            hasMediaAttachment: true,
                            imageMessage: thumbnail.imageMessage,
                        },
                        nativeFlowMessage: {
                            buttons: buttons,
                            messageParamsJson: "",
                        },
                    },
                },
            },
        }, { userJid: conn.user.jid, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '⚠️ حدث خطأ أثناء إنشاء الأزرار!', m);
    }
};

handler.help = ['جروب <قفل/فتح>'];
handler.tags = ['group'];
handler.command = /^(جروب|group)$/i;
handler.botAdmin = true;
handler.group = true;

export default handler;