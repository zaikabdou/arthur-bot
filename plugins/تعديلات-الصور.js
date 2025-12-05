import axios from 'axios';
import fetch from 'node-fetch';
import { fileTypeFromBuffer } from 'file-type';

const uploadToTysonAPI = async (buffer) => {
  const { ext } = await fileTypeFromBuffer(buffer);
  const base64 = `data:image/${ext};base64,${buffer.toString('base64')}`;

  try {
    const response = await axios.post(
      "https://tyson-dev.vercel.app/api/upload",
      { image: base64 },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data?.url) return response.data.url;
    throw new Error("فشل في رفع الصورة");
  } catch (error) {
    throw new Error(`⚠️ فشل رفع الصورة: ${error.message}`);
  }
};

let handler = async (m, { conn, text }) => {

 
  if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.includes('image')) {
    return conn.sendMessage(m.chat, {
      text: `🎨✨  *تعديل الصور* ✨🎨

⛔ لازم تــرد عـلـى صـورة الأول.

🔧 *طريقة الاستخدام:*
• رد على صورة واكتب:
\`.عـدل <نص التعديل>\``,
    });
  }

  
  let prompt = text?.trim() || "";
  if (!prompt) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *فين النص يا حب*

اكتب كده:
\`.عـدل <نص التعديل>\``,
    });
  }

  await conn.sendMessage(m.chat, {
    text: `⏳✨ *جاري تنفيذ طلبك…*

📝 الـتـعـديـل:
\`${prompt}\`

🖼️ *اسـتَـغـفر الله فـي كـل وقـت.....*`,
  });

  try {
    // ✅ تحميل الصورة
    const buffer = await m.quoted.download();

    // ✅ رفع الصورة
    const imgUrl = await uploadToTysonAPI(buffer);

    // ✅ إرسال الصورة + البرومبت إلى API التعديل
    const process = await axios.get(
      "https://api-tyson-md.vercel.app/api/ai/image-edit",
      {
        params: { image: imgUrl, prompt }
      }
    );

    if (!process.data?.result) {
      throw new Error("عملية التعديل فشلت");
    }

    const resultUrl = process.data.result;
    const attempts = process.data.attempts || 0;

    
    await conn.sendMessage(
      m.chat,
      {
        image: { url: resultUrl },
        caption:
`✅🔥 *تـم تـعـديـل الـصـورة بنجاح!*

🎨 *الوصف المستخدم:*
『 ${prompt} 』

⚡ *مدة التنفيذ:* ${attempts * 3} ثانية

لو عايز تعديل جديد:
\`.عـدل <التعديل>\``,
      },
      { quoted: m }
    );

  } catch (e) {
    m.reply(
`*حصل خطأ أثناء التعديل:*
${e.message}

🔧 جرّب تاني وهتزبط.`
    );
  }
};

handler.help = ['عدل <النص>'];
handler.tags = ['ai'];
handler.command = ['عدل'];
handler.limit = true;

export default handler;