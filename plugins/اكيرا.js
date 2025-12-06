import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let jsonPath = path.join('src', 'JSON', 'anime-akira.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور اكيرا حاليا 😔≻', m);

        let url = data[Math.floor(Math.random() * data.length)];

        await conn.sendButton(
            m.chat,
            `🔥🎴 ⇦ ≺أكـيـرا 🔥🎴≻`,
            author,
            url,
            [['عـرض الـمـزيـد 🔥🐉', `${usedPrefix + command}`]],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة اكيرا، حاول لاحقًا≻', m);
    }
}

handler.help = ['akira', 'اكيرا'];
handler.tags = ['anime'];
handler.command = /^(akira|اكيرا)$/i;

export default handler;