import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import { db } from '../lib/postgres.js';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  // جلب بيانات المستخدم من قاعدة البيانات (packname + author)
  const userResult = await db.query(
    'SELECT sticker_packname, sticker_author FROM usuarios WHERE id = $1',
    [m.sender]
  );
  const user = userResult.rows[0] || {};
  let f = user.sticker_packname || global.info.packname;
  let g = (user.sticker_packname && user.sticker_author
    ? user.sticker_author
    : (user.sticker_packname && !user.sticker_author ? '' : global.info.author)
  );

  if (!text) {
    return m.reply(
      `⚠️ ارسل نصًا ليتم تحويله إلى ملصق.\nمثال:\n*${usedPrefix + 'كتابة'}* مرحبًا`
    );
  }

  let teks = encodeURI(text);
  conn.fakeReply(
    m.chat,
    `⏳ جاري تحويل النص إلى ملصق... قد يستغرق بعض الثواني.`,
    '0@s.whatsapp.net',
    `الرجاء الانتظار`,
    'status@broadcast'
  );

  const cmd = (command || '').toString().toLowerCase();

  try {
    // مجموعة أوامر attp (نص متحرك صغير)
    if (/(?:attp|اتتب|متحرك|نص_متحرك|نصمتحرك)/i.test(cmd)) {
      if (text.length > 40)
        return m.reply(`⚠️ النص لا يمكن أن يتجاوز 40 حرفًا.\nحاول بنص أقصر.`);
      let res = await fetch(`https://api.neoxr.eu/api/attp?text=${teks}%21&color=%5B%22%23FF0000%22%2C+%22%2300FF00%22%2C+%22%230000FF%22%5D&apikey=${info.neoxr.key}`);
      let json = await res.json();
      if (!json.status) return m.reply('❌ فشلت استجابة الـ API، حاول لاحقًا.');
      let stiker = await sticker(null, json.data.url, f, g);
      conn.sendFile(
        m.chat,
        stiker,
        'sticker.webp',
        '',
        m,
        true,
        {
          contextInfo: {
            forwardingScore: 200,
            isForwarded: false,
            externalAdReply: {
              showAdAttribution: false,
              title: info.wm,
              body: info.vs,
              mediaType: 2,
              sourceUrl: info.md,
              thumbnail: m.pp
            }
          }
        },
        { quoted: m }
      );
    }

    // مجموعة أوامر ttp / brat (صورة/ستيكَر نصي)
    else if (/(?:ttp|brat|ttp2|تحويل|كتابة|نص|نص_ستكر)/i.test(cmd)) {
      if (text.length > 300)
        return m.reply(`⚠️ النص لا يمكن أن يتجاوز 300 حرفًا.\nحاول بنص أقصر.`);
      let res = await fetch(`https://api.neoxr.eu/api/brat?text=${teks}&apikey=${info.neoxr.key}`);
      let json = await res.json();
      if (!json.status) return m.reply('❌ فشلت استجابة الـ API، حاول لاحقًا.');
      let stiker = await sticker(null, json.data.url, f, g);
      conn.sendFile(
        m.chat,
        stiker,
        'sticker.webp',
        '',
        m,
        true,
        {
          contextInfo: {
            forwardingScore: 200,
            isForwarded: false,
            externalAdReply: {
              showAdAttribution: false,
              title: info.wm,
              body: info.vs,
              mediaType: 2,
              sourceUrl: info.md,
              thumbnail: m.pp
            }
          }
        },
        { quoted: m }
      );
    }

    // مجموعة أوامر brat2 / bratvid (فيديو ملصق قصير)
    else if (/(?:brat2|bratvid|فيديو_ستكر|ستكر_فيديو|فيديو)/i.test(cmd)) {
      if (text.length > 250)
        return m.reply(`⚠️ النص لا يمكن أن يتجاوز 250 حرفًا.\nحاول بنص أقصر.`);
      let res = await fetch(`https://api.neoxr.eu/api/bratvid?text=${teks}&apikey=${info.neoxr.key}`);
      let json = await res.json();
      if (!json.status) return m.reply('❌ فشلت استجابة الـ API، حاول لاحقًا.');
      let stiker = await sticker(null, json.data.url, f, g);
      conn.sendFile(
        m.chat,
        stiker,
        'sticker.webp',
        '',
        m,
        true,
        {
          contextInfo: {
            forwardingScore: 200,
            isForwarded: false,
            externalAdReply: {
              showAdAttribution: false,
              title: info.wm,
              body: info.vs,
              mediaType: 2,
              sourceUrl: info.md,
              thumbnail: m.pp
            }
          }
        },
        { quoted: m }
      );
    } else {
      // لم يطابق الأمر أي مجموعة معروفة (نادر)
      return m.reply('⚠️ أمر غير معروف.');
    }
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '⚠️ حدث خطأ: ' + (e.message || e), m);
  }
}

handler.help = ['كتابة', 'متحرك', 'فيديو_ستكر'];
handler.tags = ['sticker', 'ملصق'];
handler.command = /^(attp|ttp|ttp2|brat|brat2|bratvid|اتتب|كتابة|تحويل|متحرك|نص_متحرك|فيديو_ستكر|ستكر_فيديو|نص_ستكر)$/i;
handler.register = true;

export default handler;