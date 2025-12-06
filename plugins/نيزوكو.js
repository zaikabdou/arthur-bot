import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // مسار JSON النسبي داخل مجلد البوت
        let jsonPath = path.join('src', 'JSON', 'anime-nezuko.json');
        let data = JSON.parse(fs.readFileSync(jsonPath));

        if (!Array.isArray(data) || data.length === 0)
            return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور نيزوكو حاليا 😔≻', m);

        // اختيار صورة عشوائية
        let url = data[Math.floor(Math.random() * data.length)];

        // إرسال الصورة مع زر “التالي”
        await conn.sendButton(
            m.chat,
            `🌸 ⇦ ≺نـيـزوكـو 🌸≻`,
            author,
            url,
            [
                ['عـرض الـمـزيـد 🔥🐉', `${usedPrefix + command}`]
            ],
            m
        );

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة نيزوكو، حاول لاحقًا≻', m);
    }
}

handler.help = ['nezuko', 'نيزوكو'];
handler.tags = ['anime'];
handler.command = /^(nezuko|نيزوكو)$/i;

export default handler;