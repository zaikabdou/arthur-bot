import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let jsonPath = path.join('src', 'JSON', 'anime-emilia.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور ايميليا حاليا 😔≻', m);

        let url = data[Math.floor(Math.random() * data.length)];

        await conn.sendButton(
            m.chat,
            `❄️✨ ⇦ ≺ايـمـيـلـيـا ❄️✨≻`,
            author,
            url,
            [['الـجـايه يـا ارثــــر ⚡', `${usedPrefix + command}`],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة ايميليا، حاول لاحقًا≻', m);
    }
}

handler.help = ['emilia', 'ايميليا'];
handler.tags = ['anime'];
handler.command = /^(emilia|ايميليا)$/i;

export default handler;