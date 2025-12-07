import axios from 'axios';

let sentVideos = new Set(); // لتخزين الفيديوهات التي تم إرسالها لتجنب التكرار

let handler = async (message, { conn, text }) => {
  // إرسال رد فعل عند بدء البحث
  await conn.sendMessage(message.chat, { react: { text: "🎥", key: message.key } });

  // التحقق من إدخال النص
  if (!text) {
    return await conn.sendMessage(message.chat, { text: "⚠️ *الرجاء إدخال اسم الفيديو أو النص المطلوب للبحث عنه.*\n\nمثال: .تصميم سورة المؤمنون" });
  }

  // إضافة كلمة "تصميم" للنص المدخل
  const query = `تصميم ${text}`;

  try {
    // البحث عن الفيديو
    let { data: response } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${query}`);
    let searchResults = response.data;

    // التحقق من وجود نتائج
    if (!searchResults.length) {
      return await conn.sendMessage(message.chat, { text: `⚠️ لم يتم العثور على نتائج لكلمة البحث: *${query}*` });
    }

    // فلترة الفيديوهات التي تم إرسالها بالفعل
    let availableResults = searchResults.filter(result => !sentVideos.has(result.nowm));

    // إذا كانت كل الفيديوهات تم إرسالها بالفعل
    if (availableResults.length === 0) {
      return await conn.sendMessage(message.chat, { text: "⚠️ كل الفيديوهات تم إرسالها بالفعل." });
    }

    // اختيار فيديو عشوائي
    let result = availableResults[Math.floor(Math.random() * availableResults.length)];

    // إضافة الفيديو الذي تم إرساله إلى المجموعة لتجنب تكراره
    sentVideos.add(result.nowm);

    // إرسال الفيديو
    await conn.sendMessage(message.chat, {
      video: { url: result.nowm }, // رابط الفيديو بدون علامة مائية
// إزالة أي كلمة تحتوي # أو @
let cleanTitle = result.title.split(' ')
                             .filter(word => !word.includes('#') && !word.includes('@'))
                             .join(' ');

// تمرير العنوان المنظف للـ caption
caption: `*⇦ ≺ ${cleanTitle}*\n\n> *© mᥲძᥱ ᥕі𝗍һ ᑲᥡ 𝙰𝙱𝙳𝙾𝚄*`
    // الرد في حالة وجود خطأ
    await conn.sendMessage(message.chat, { text: `⚠️ حدث خطأ أثناء البحث: ${error.message}` });
  }
};

handler.help = ['تصميم'];
handler.tags = ['search'];
handler.command = ['تصميم']; // اسم الأمر

export default handler;