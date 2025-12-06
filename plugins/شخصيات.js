import { prepareWAMessageMedia, generateWAMessageFromContent } from "@whiskeysockets/baileys";

let handler = async (m, { conn, usedPrefix }) => {
    try {
        // 📝 قائمة الشخصيات مع الإيموجي لكل شخصية
        let characters = [
            { name: 'ساسكي', emoji: '🗡️', command: 'sasuke' },
            { name: 'ناروتو', emoji: '🍥', command: 'naruto' },
            { name: 'ساغيري', emoji: '🎀', command: 'sagiri' },
            { name: 'نيزوكو', emoji: '🎋', command: 'nezuko' },
            { name: 'ساكورا', emoji: '🌸', command: 'sakura' },
            { name: 'ميناتو', emoji: '⚡', command: 'minato' },
            { name: 'مادارا', emoji: '🔥', command: 'madara' },
            { name: 'كوتوري', emoji: '🐦', command: 'kotori' },
            { name: 'كاغورا', emoji: '🎐', command: 'kagura' },
            { name: 'كاغا', emoji: '💥', command: 'kaga' },
            { name: 'ايتوري', emoji: '🐦', command: 'itori' },
            { name: 'ايتاشي', emoji: '🌑', command: 'itachi' },
            { name: 'ايسوزي', emoji: '🌀', command: 'isuzu' },
            { name: 'اينوري', emoji: '🎤', command: 'inori' },
            { name: 'هيناتا', emoji: '💜', command: 'hinata' },
            { name: 'هيستيا', emoji: '✨', command: 'hestia' },
            { name: 'ايرزا', emoji: '🔥', command: 'erza' },
            { name: 'ايميليا', emoji: '❄️', command: 'emilia' },
            { name: 'ايلاينا', emoji: '🌙', command: 'elaina' },
            { name: 'ايبا', emoji: '🎴', command: 'eba' },
            { name: 'ديدرا', emoji: '💀', command: 'deidara' },
            { name: 'كوسبلاي', emoji: '🎭', command: 'cosplay' },
            { name: 'شيهو', emoji: '🌸', command: 'chiho' },
            { name: 'شيتوغي', emoji: '💖', command: 'chitoge' },
            { name: 'بوروتو', emoji: '🌪️', command: 'boruto' },
            { name: 'اسونا', emoji: '🗡️', command: 'asuna' },
            { name: 'اانا', emoji: '🌹', command: 'anna' },
            { name: 'اكيرا', emoji: '🔥', command: 'akira' },
            { name: 'ميكاسا', emoji: '🛡️', command: 'mikasa' },
            { name: 'ميكو', emoji: '🎤', command: 'miku' }
        ];

        // 🖋️ نص منسق
        let text = '✨🌟 ⇦ قائمة الشخصيات المتوفرة ⇦ 🌟✨\n\n';
        characters.forEach((c, i) => {
            text += `${i+1}. ${c.emoji} ${c.name}\n`;
        });

        // 🖼️ الصورة المصغرة
        const imageUrl = "https://files.catbox.moe/wo4zhx.jpg";
        const media = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer });

        // 🟦 أزرار لكل شخصية (3 لكل صف)
        let buttons = characters.map(c => ({
            buttonId: `${usedPrefix}${c.command}`,
            buttonText: { displayText: `${c.emoji} ${c.name}` },
            type: 1
        }));

        // إنشاء الرسالة التفاعلية
        const interactiveMessage = {
            text,
            footer: 'Arthur Bot ⚡',
            headerType: 4,
            imageMessage: media.imageMessage,
            buttons
        };

        const msg = generateWAMessageFromContent(m.chat, { templateMessage: { hydratedTemplate: interactiveMessage } }, { userJid: conn.user.jid, quoted: m });
        conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, 'حدث خطأ أثناء عرض قائمة الشخصيات.', m);
    }
};

handler.help = ['شخصيات'];
handler.tags = ['anime'];
handler.command = /^شخصيات$/i;

export default handler;