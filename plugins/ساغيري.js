import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // مسار JSON النسبي داخل مجلد البوت
        let jsonPath = path.join('src', 'JSON', 'anime-sagiri.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور ساغيري حاليا 😔≻', m);

        // اختيار صورة عشوائية
        let url = data[Math.floor(Math.random() * data.length)];

        // إرسال الصورة مع زر “التالي”
        await conn.sendButton(
            m.chat,
            `⚡ ⇦ ≺سـاغـيـري ⚡≻`,
            author,
            url,
            [
                ['عـرض الـمـزيـد 🔥🐉', `${usedPrefix + command}`]
            ],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة ساغيري، حاول لاحقًا≻', m);
    }
}

handler.help = ['sagiri', 'ساغيري'];
handler.tags = ['anime'];
handler.command = /^(sagiri|ساغيري)$/i;

export default handler;