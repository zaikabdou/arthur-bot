import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let jsonPath = path.join('src', 'JSON', 'anime-madara.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور مادارا حاليا 😔≻', m);

        let url = data[Math.floor(Math.random() * data.length)];

        await conn.sendButton(
            m.chat,
            `🔥🗡️ ⇦ ≺مـادارَا 🔥🗡️≻`,
            author,
            url,
            [['الـجـايه يـا ارثــــر ⚡', `${usedPrefix + command}`],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة مادارا، حاول لاحقًا≻', m);
    }
}

handler.help = ['madara', 'مادارا'];
handler.tags = ['anime'];
handler.command = /^(madara|مادارا)$/i;

export default handler;