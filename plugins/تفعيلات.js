const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  const optionsFull = `*الخيار:* ✨ | الترحيب
*الامر:* ${usedPrefix + command} الترحيب
*الوصف:* فتح او قفل الترحيب في الجروب.

--------------------------------

*الخيار:* 🌎 | مود العام
*الامر:* ${usedPrefix + command} عام
*الوصف:* يصبح البوت علنا او خاصا.
*الحاله:* لا يمكن استخدام هذا الامر الا بواسطه المطور.

--------------------------------

*الخيار:* 🔗 | مضاد اللينكات
*الامر:* ${usedPrefix + command} مضاداللينكات
*الحاله:* تشغيل او ايقاف مضاد لينكات الواتس.
*الحاله:* يجب ان يكون مفعلا.

--------------------------------

*الخيار:* 🔗 | مضاد اللنكات 2
*الامر:* ${usedPrefix + command} مضاداللينكات2
*الوصف:* تشغيل وا اقاف مضاد اي لنكات.
*الحاله:* يجب ان يكون مفعلا.

--------------------------------

*الخيار:* 🔎 | كشف
*الامر:* ${usedPrefix + command} كشف
*:* تنشيط او الغاء التعديل علي الوصف.

--------------------------------

*الخيار:* 🔎 | كشف 2
*الامر:* ${usedPrefix + command} كشف2
*الوصف:* يكشف التعديلات في المجموعه و يحافظ علي اداره افضل.

--------------------------------

*الخيار:* ❗ | يقيد
*الامر:* ${usedPrefix + command} تقيد
*وصف:* فتح او قفل قيود البوت مثلا  يطرد و يضيفه.
*حاله:* المطور بس الي يستعمل الامر ده.

--------------------------------

*الخيار:* ☑️ | القرائه التلقائي
*الامر:* ${usedPrefix + command} الصحين
*الوصف:* فتح او قفل القرائه التلقائي.
*الحاله:* المطور بس الي بيتسعمل الامر ده.

--------------------------------

*الخيار:* 🔊 |  اصوات
*الامر:* ${usedPrefix + command} اصوات
*الوصف:* فتح او قفل الريكات في الجروب.

--------------------------------

*الخيار:* 👾 | ستيكر تلقائي
*الامر:* ${usedPrefix + command} ستيكرتلقائي 
*الوصف:*تصبح جميع الصور أو مقاطع الفيديو المرسلة في المجموعة ملصقات. 

--------------------------------

*الخيار:* 💬 | خاص فقط
*الامر:* ${usedPrefix + command} برايفت
*الوصف:* سوف يستجيب البوت في الخاص بس.
*الحاله:* المطور بس الي يقدر يستعمل الامر ده.

--------------------------------

*الخيار:* 🏢 | جروبات فقط
*الامر:* ${usedPrefix + command} جروبات
*الوصف:* البوت هيشتغل في الجروبات بس. 
*الحاله:* المطور بس الي يستخدم الامر ده.

--------------------------------

*الخيار:* ❌ | مضاد الاخفاء
*الامر:* ${usedPrefix + command} مضادالاخفاء
*الوصف:* الصوره او الفيديو الذي يبعت ليرا مره واحده يبعت من البوت مره اخري بشكل طبيعي. 

--------------------------------

*الخيار:* 📵 | ممنوع الاتصال
*الامر:* ${usedPrefix + command} مضادالاتصال
*الوصف:* يبلك اي حد يرن علي رقم البوت. 
*الحاله:* المطور بس الي يستخدم الامر ده.

--------------------------------

*الخيار:* 💬 | مضاد الخاص
*الامر:* ${usedPrefix + command} مضادالخاص
*الوصف:* يبلك اي حد يكلم البوت خاص. 
*الحاله:* المطور بس الي يستخدم الامر ده.

--------------------------------

*الخيار:* 🤬 | مضاد الشتائم
*الامر:* ${usedPrefix + command} مضاد_الشتم
*الوصف:* يقوم بتحذير اي شخص سب او شتم او كتب شئ عيب واذا تجاوز التحذيرات يقوم بطرده.
*الحاله:* يجب ان يكون التقيد مفعلا.

--------------------------------

*الخيار:* 🤖 | البوت الفرعي
*الامر:* ${usedPrefix + command} البوت-الفرعي
*الحاله:* تفعيل و اقاف امر (${usedPrefix}serbot / ${usedPrefix}jadibot). 
*الحاله:* المطور بس الي يقدر يستعمل الامر ده.

--------------------------------

*الخيار:* 👑 | الادمن
*الامر:* ${usedPrefix + command} الادمن-فقط
*الوصف:* سوف يجيب البوت علي الادمن فقط.

--------------------------------

*الخيار:* 😃 | سمسمي
*الامر:* ${usedPrefix + command} سمسمي
*الوصف:* هيبدا البوت يرد باستخدام الذكاء الصتناعي سمسمي.

--------------------------------

*الخيار:* ⏳ | مضاد الاسبام
*الامر:* ${usedPrefix + command} مضادالاسبام
*الوصف:* يكتشف البوت بعد ارسال 5 رسائل و يحظر المستخدم.
*الحاله:* المطور بس الي يستخدم الامر ده.

--------------------------------

*الخيار:* 🛡️ | مضاد الحذف
*الامر:* ${usedPrefix + command} مضادالحذف
*الوصف:* يكتشف البوت الرساله المحذوفه و يقوم بتحويلها للمستخدم.

--------------------------------

*الخيار:* 🔊 | صوت_بوت
*الامر:* ${usedPrefix + command} اصوات_البوت
*الوصف:* يتم الغاء جميعرالصوات الخاصه بالبوت .
*الحاله:* المطور بس الي يستخدم الامر ده.`.trim();

  // فصل الأمر (فتح/قفل/فعل...) عن اسم الخيار
  const cmd = (command || '').toString().toLowerCase();
  // نجمع كل الباقي كخيار واحد: يدعم "مضاد الشتم" و "مضاد_الشتم"
  const type = (Array.isArray(args) ? args.join('_') : (args || []).join('_') || '').toLowerCase();

  // isEnable يعتمد على الأمر نفسه (فتح/فعل => true, قفل => false)
  const isEnable = /^(فتح|فعل|enable|on|true|1)$/i.test(cmd);

  // بيانات المحادثة والمستخدم والبوت
  const chat = global.db?.data?.chats?.[m.chat] || {};
  const user = global.db?.data?.users?.[m.sender] || {};
  const bot = global.db?.data?.settings?.[conn.user.jid] || {};
  let isAll = false;
  const isUser = false;

  // إذا لم يكتب خيار نعرض القائمة كاملة
  if (!type) return await conn.sendMessage(m.chat, { text: optionsFull }, { quoted: m });

  switch (type) {
    case 'الترحيب':
      if (!m.isGroup && !isOwner) { global.dfail('group', m, conn); throw false; }
      if (m.isGroup && !(isAdmin || isOwner || isROwner)) { global.dfail('admin', m, conn); throw false; }
      chat.welcome = isEnable;
      break;

    case 'كشف':
      if (!m.isGroup && !isOwner) { global.dfail('group', m, conn); throw false; }
      if (m.isGroup && !isAdmin) { global.dfail('admin', m, conn); throw false; }
      chat.detect = isEnable;
      break;

    case 'كشف2':
      if (!m.isGroup && !isOwner) { global.dfail('group', m, conn); throw false; }
      if (m.isGroup && !isAdmin) { global.dfail('admin', m, conn); throw false; }
      chat.detect2 = isEnable;
      break;

    case 'سمسمي':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.simi = isEnable;
      break;

    case 'مضاداللينكات':
    case 'مضاد_اللينكات':
    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antiLink = isEnable;
      break;

    case 'مضاداللينكات2':
    case 'مضاد_اللينكات2':
    case 'antilink2':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antiLink2 = isEnable;
      break;

    case 'مضادالاخفاء':
    case 'مضاد_الاخفاء':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antiviewonce = isEnable;
      break;

    case 'الادمن-فقط':
    case 'الادمن_فقط':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.modoadmin = isEnable;
      break;

    case 'ستيكرتلقائي':
    case 'ستيكر_تلقائي':
    case 'ستيكرتلقائي':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.فتحsticker = isEnable;
      break;

    case 'اصوات':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.audios = isEnable;
      break;

    case 'مضاد_الحذف':
    case 'مضادالحذف':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antidelete = isEnable;
      break;

    case 'تقيد':
      isAll = true;
      if (!isOwner) { global.dfail('owner', m, conn); throw false; }
      bot.restrict = isEnable;
      break;

    case 'اصوات_البوت':
    case 'اصوات-البوت':
      isAll = true;
      if (!isOwner) { global.dfail('owner', m, conn); throw false; }
      bot.audios_bot = isEnable;
      break;

    case 'عام':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      global.opts = global.opts || {};
      global.opts['self'] = !isEnable;
      break;

    case 'nyimak':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      global.opts = global.opts || {};
      global.opts['nyimak'] = isEnable;
      break;

    case 'الصحين':
    case 'القراءه':
    case 'الصحين':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      bot.فتحread2 = isEnable;
      global.opts = global.opts || {};
      global.opts['فتحread'] = isEnable;
      break;

    case 'برايفت':
    case 'privateonly':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      global.opts = global.opts || {};
      global.opts['pconly'] = isEnable;
      break;

    case 'جروبات':
    case 'grouponly':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      global.opts = global.opts || {};
      global.opts['gconly'] = isEnable;
      break;

    case 'swonly':
    case 'statusonly':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      global.opts = global.opts || {};
      global.opts['swonly'] = isEnable;
      break;

    case 'مضادالمكالمات':
    case 'مضاد_المكالمات':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      bot.antiCall = isEnable;
      break;

    case 'مضاد_الخاص':
    case 'مضادالخاص':
    case 'مضادالخاص':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      bot.antiPrivate = isEnable;
      break;

    case 'البوت-الفرعي':
    case 'البوت_الفرعي':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      bot.modejadibot = isEnable;
      break;

    case 'مضادالاسبام':
    case 'مضاد_الاسبام':
      isAll = true;
      if (!isROwner) { global.dfail('rowner', m, conn); throw false; }
      bot.antispam = isEnable;
      break;

    case 'مضاد_الشتم':
    case 'مضادالشتم':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antiToxic = isEnable;
      break;

    case 'antitraba':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antiTraba = isEnable;
      break;

    case 'antiarabes':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antiArab = isEnable;
      break;

    case 'antiarabes2':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false; }
      chat.antiArab2 = isEnable;
      break;

    default:
      // خيار غير معروف -> نعرض القائمة
      return await conn.sendMessage(m.chat, { text: optionsFull }, { quoted: m });
  }

  // حفظ التغييرات إن لزم (بعض أنظمة بوت تحتاج حفظ يدوي هنا)
  // مثال: global.db.write?.();

  // إرسال رسالة التأكيد
  const displayOption = args.length ? args.join(' ') : type;
  conn.sendMessage(m.chat, {
    text: `🖤 الخيار: ${displayOption}\n🥷🏻 الحالة: ${isEnable ? 'شغال' : 'قافل'}\n🍉 للـ: ${isAll ? 'هذا البوت' : isUser ? '' : 'هذه الدردشة'}`
  }, { quoted: m });
};

handler.help = ['فتح', 'قفل'].map((v) => v + ' <الخيار>');
handler.tags = ['group', 'owner'];
handler.command = /^((فتح|قفل|فعل|enable|disable|en|dis)|(turn)?[01])$/i;
export default handler;