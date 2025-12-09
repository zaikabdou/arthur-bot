import { db } from '../lib/postgres.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`*⚠️ الاستخدام:* ${usedPrefix}${command} اسم_الحزمة | المؤلف\n*مثال:* ${usedPrefix}${command} حزمةي | مؤلفي`)

    let text = args.join(' ').split('|');
    let packname = text[0].trim();
    let author = text[1] ? text[1].trim() : '';

    if (!packname) return m.reply('⚠️ يجب إدخال اسم حزمة على الأقل.');
    if (packname.length > 600) return m.reply('⚠️ اسم الحزمة طويل جدًا (الحد الأقصى 600 حرف).');
    if (author && author.length > 650) return m.reply('⚠️ اسم المؤلف طويل جدًا (الحد الأقصى 650 حرف).');

    await db.query(`UPDATE usuarios
          SET sticker_packname = $1,
              sticker_author = $2
          WHERE id = $3`, [packname, author || null, m.sender]);

    await m.reply(`✅ تم تحديث بيانات *EXIF* لستيكراتك بنجاح. الآن كل ستيكر تنشئه سيحمل:\n\n◉ *اسم الحزمة:* ${packname}\n◉ *المؤلف:* ${author || 'لا يوجد'}\n\n> استمتع بإنشاء ستيكرات مخصصة! 😎`)
};

handler.help = ['حقوقي <اسم_الحزمة> | <المؤلف>'];
handler.tags = ['sticker'];
handler.command = ['حقوقي'];
handler.register = true;

export default handler;