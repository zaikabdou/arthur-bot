import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let jsonPath = path.join('src', 'JSON', 'anime-kagura.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور كاغورا حاليا 😔≻', m);

        let url = data[Math.floor(Math.random() * data.length)];

        await conn.sendButton(
            m.chat,
            `🌸🔥 ⇦ ≺كـاغـورَا 🌸🔥≻`,
            author,
            url,
            [['عـرض الـمـزيـد 🔥🐉', `${usedPrefix + command}`]],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة كاغورا، حاول لاحقًا≻', m);
    }
}

handler.help = ['kagura', 'كاغورا'];
handler.tags = ['anime'];
handler.command = /^(kagura|كاغورا)$/i;

export default handler;