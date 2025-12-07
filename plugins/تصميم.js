import axios from 'axios';

let sentVideos = new Set(); // حافظ مؤقت لمنع تكرار الفيديوهات أثناء تشغيل الجلسة

let handler = async (message, { conn, text }) => {
  try {
    // تفاعل دخول البحث
    await conn.sendMessage(message.chat, { react: { text: '🎥', key: message.key } });

    if (!text) {
      return await conn.sendMessage(message.chat, {
        text: "⚠️ *الرجاء إدخال اسم الفيديو أو النص المطلوب للبحث عنه.*\n\nمثال: .تصميم سورة المؤمنون"
      }, { quoted: message });
    }

    const query = `تصميم ${text}`;

    // طلب الـ API
    const { data: apiRes } = await axios.get(
      `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`,
      { timeout: 10000 }
    );

    // بعض الـ APIs تعيد data.data أو data مباشرة — نتعامل مع الاحتمالين
    const searchResults = apiRes?.data ?? apiRes ?? [];

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return await conn.sendMessage(message.chat, {
        text: `⚠️ لم يتم العثور على نتائج لكلمة البحث: *${query}*`
      }, { quoted: message });
    }

    // فلترة الفيديوهات التي تحتوي على رابط صالح ولم تُرسل من قبل
    const availableResults = searchResults.filter(r => r && r.nowm && !sentVideos.has(r.nowm));

    if (availableResults.length === 0) {
      return await conn.sendMessage(message.chat, { text: "⚠️ كل الفيديوهات تم إرسالها بالفعل." }, { quoted: message });
    }

    const result = availableResults[Math.floor(Math.random() * availableResults.length)];
    sentVideos.add(result.nowm);

    // تنظيف العنوان من أي هاشتاق أو منشن
    const cleanTitle = (result.title || '')
      .split(' ')
      .filter(word => !word.includes('#') && !word.includes('@'))
      .join(' ')
      .trim() || 'تصميم';

    // إرسال الفيديو مع caption
    await conn.sendMessage(message.chat, {
      video: { url: result.nowm },
      caption: `*⇦ ≺ ${cleanTitle}*\n\n> *© mᥲძᥱ ᥕі𝗍һ ᑲᥡ 𝙰𝙱𝙳𝙾𝚄*`
    }, { quoted: message });

  } catch (error) {
    console.error('تصميم handler error:', error);
    await conn.sendMessage(message.chat, {
      text: `⚠️ حدث خطأ أثناء البحث: ${error?.message || String(error)}`
    }, { quoted: message }).catch(() => {});
  }
};

handler.help = ['تصميم'];
handler.tags = ['search'];
handler.command = ['تصميم'];

export default handler;