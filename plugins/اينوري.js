import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let jsonPath = path.join('src', 'JSON', 'anime-inori.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور اينوري حاليا 😔≻', m);

        let url = data[Math.floor(Math.random() * data.length)];

        await conn.sendButton(
            m.chat,
            `🌺💫 ⇦ ≺ايـنـوري 🌺💫≻`,
            author,
            url,
            [['الـجـايه يـا ارثــــر ⚡', `${usedPrefix + command}`],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة اينوري، حاول لاحقًا≻', m);
    }
}

handler.help = ['inori', 'اينوري'];
handler.tags = ['anime'];
handler.command = /^(inori|اينوري)$/i;

export default handler;