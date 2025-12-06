import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let jsonPath = path.join('src', 'JSON', 'anime-eba.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور ايبا حاليا 😔≻', m);

        let url = data[Math.floor(Math.random() * data.length)];

        await conn.sendButton(
            m.chat,
            `🌟🎵 ⇦ ≺ايـبـا 🌟🎵≻`,
            author,
            url,
            [['عـرض الـمـزيـد 🔥🐉', `${usedPrefix + command}`]],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة ايبا، حاول لاحقًا≻', m);
    }
}

handler.help = ['eba', 'ايبا'];
handler.tags = ['anime'];
handler.command = /^(eba|ايبا)$/i;

export default handler;