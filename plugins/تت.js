import db from '../lib/database.js';
import { createHash } from 'crypto';
import fetch from 'node-fetch';

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];
  let name2 = conn.getName(m.sender);

  // التحقق من التسجيل
  if (user.registered === true) {
    return m.reply(`[ ✰ ] أنت مسجل بالفعل.`);
  }

  // التحقق من صحة النص المُدخل
  if (!Reg.test(text)) {
    return m.reply(
      `*[ ✰ ] الرجاء إدخال اسم المستخدم والعمر للتسجيل.*\n\n*📌 مثال الاستخدام:*\n*${usedPrefix + command}* محمد.25`
    );
  }

  let [_, name, splitter, age] = text.match(Reg);
  if (!name) return conn.reply(m.chat, '*[ ✰ ] الاسم لا يمكن أن يكون فارغاً.', m);
  if (!age) return conn.reply(m.chat, '*[ ✰ ] العمر لا يمكن أن يكون فارغاً.*', m);

  // معالجة العمر والبيانات
  age = parseInt(age);
  user.name = name.trim();
  user.age = age;
  user.regTime = +new Date();
  user.registered = true;

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6);

  // تحميل الصورة
  let imgUrl = `https://qu.ax/rJHDD.jpg`;
  let imgBuffer;
  try {
    imgBuffer = await (await fetch(imgUrl)).buffer();
  } catch (error) {
    console.error('[ERROR] فشل تحميل الصورة:', error);
    return m.reply('[ERROR] لم نتمكن من تحميل الصورة. حاول لاحقاً.');
  }

  // إنشاء النص النهائي
  let now = new Date();
  let date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  let time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let txt = '*`📄 تسجيل البيانات 📄`*\n';
  txt += `\`━━━━━━━━━━━━━━━━━━━━\`\n`;
  txt += `*\`⁘ الاسم:\`* ${name}\n`;
  txt += `*\`⁘ العمر:\`* ${age} عامًا\n`;
  txt += `*\`⁘ التاريخ:\`* ${date}\n`;
  txt += `*\`⁘ الرقم التسلسلي:\`* ${sn}\n`;
  txt += `\`━━━━━━━━━━━━━━━━━━━━\``;

  let dev = '*© تم بواسطة  𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃*';

  // إرسال الرسالة مع الصورة
  await conn.sendMessage(
    m.chat,
    {
      image: imgBuffer,
      caption: txt,
      footer: dev,
      buttons: [
        {
          buttonId: `.perfil`,
          buttonText: { displayText: '👤 الملف الشخصي' },
        },
        {
          buttonId: `.owner`,
          buttonText: { displayText: '☁️ المالك' },
        },
        {
          buttonId: `.ping`,
          buttonText: { displayText: '📶 الحالة' },
        },
      ],
      viewOnce: true,
      headerType: 4,
    },
    { quoted: m }
  );

  // رد فعل
  await m.react('✅');
};

// تعريف الأوامر والمساعدة
handler.help = ['reg'].map((v) => v + ' *<الاسم.العمر>*');
handler.tags = ['start'];
handler.command = ['reg', 'سجل', 'register', 'registrar'];

export default handler;