export async function before(m, { conn }) {
  try {
    // تجاهل رسائل البايلز المرسلة من البوت نفسه
    if (m.isBaileys && m.fromMe) return true;

    // لا نؤثر على عمل البوت في الجروبات — نترك الرسائل الجماعية تمر
    if (m.isGroup) return false;

    // دالة مساعدة لاستخراج النص من مختلف أشكال رسالة Baileys
    const extractText = (message) => {
      if (!message) return '';
      // نص بسيط (old)
      if (message.conversation) return message.conversation;
      // رسائل مكتوبة مطوّلة
      if (message.extendedTextMessage && message.extendedTextMessage.text) return message.extendedTextMessage.text;
      // الكابتشا / التعليقات في وسائط
      if (message.imageMessage && message.imageMessage.caption) return message.imageMessage.caption;
      if (message.videoMessage && message.videoMessage.caption) return message.videoMessage.caption;
      if (message.stickerMessage && message.stickerMessage.caption) return message.stickerMessage.caption;
      if (message.documentMessage && message.documentMessage.caption) return message.documentMessage.caption;
      // reply button / list response texts
      if (message.templateButtonReplyMessage && message.templateButtonReplyMessage.selectedId) return message.templateButtonReplyMessage.selectedId;
      if (message.buttonsResponseMessage && message.buttonsResponseMessage.selectedButtonId) return message.buttonsResponseMessage.selectedButtonId;
      // default empty
      return '';
    };

    const text = (typeof m.text === 'string' && m.text) || extractText(m.message) || '';
    // لو ما فيه نص قابل للفحص نرجع true (تجاهل)
    if (!text || text.trim().length === 0) return true;

    // كلمات مسموح بها (حسّاس لحالة الحروف بشكل غير مُلزم)
    const allowedWords = ['PIEDRA', 'PAPEL', 'TIJERA', 'serbot', 'jadibot'];
    const textUpper = text.toUpperCase();
    if (allowedWords.some(w => textUpper.includes(w.toUpperCase()))) return true;

    // إعدادات البوت بأمان (تأكد من وجود البنية)
    const settings = (global.db && global.db.data && global.db.data.settings) ? global.db.data.settings : {};
    const jid = (conn && conn.user && conn.user.jid) ? conn.user.jid : null;
    const botSettings = jid ? (settings[jid] || {}) : {};

    // لو خاصية منع الخاص غير مفعلة نترك الرسالة تمر
    if (!botSettings.antiPrivate) return false;

    // أرقام المطورين المسموحين (بدون رموز)
    const developers = ['213551217759', '213773231685'];

    // نحول رقم المرسل إلى سلسلة أرقام فقط (بدون + أو @)
    const senderNumber = (m.sender || '').replace(/[^0-9]/g, '');

    // لو المرسل رقم مطور أو ضمن الاستثناءات نسمح
    if (developers.includes(senderNumber)) return true;

    // تحذير المستخدم في الخاص (اذكر المرسل)
    try {
      await m.reply(
        `*_⊱─═⪨༻𓆩〘⚡〙𓆪༺⪩═─⊰_*\n` +
        `*❪🌪❫:•⪼ ممنوع الكلام في الخاص لذلك سيتم حظرك تلقائياً*\n` +
        `*┊🌩┊:•⪼ للتواصل مع المطور ⇇ ❪ https://wa.me/213551217759 ❫*\n` +
        `*_⊱─═⪨༻𓆩〘⚡〙𓆪༺⪩═─⊰_*\n` +
        `*┊🌩┊:•⪼ تفضّل للانضمام إلى مجموعة البوت:*\n` +
        `https://chat.whatsapp.com/CvWNDXXjw1J8K7y92bPycz`,
        false,
        { mentions: [m.sender] }
      );
    } catch (e) {
      // إن فشل الإرسال فلا نوقف التنفيذ — قد يكون السبب عدم توافر الدالة m.reply في النسخة
      console.error('قبل: فشل في إرسال تحذير الخاص:', e);
    }

    // محاولة حظر المستخدم (ندعم أكثر من واجهة updateBlockStatus لتوافق الإصدارات)
    try {
      if (typeof conn.updateBlockStatus === 'function') {
        // بعض نسخ البايلز تستخدم boolean، وبعضها 'block'/'unblock'
        try {
          await conn.updateBlockStatus(m.sender, true);
        } catch {
          try {
            await conn.updateBlockStatus(m.sender, 'block');
          } catch (err) {
            console.error('قبل: محاولة حظر بمختلف الصيغ فشلت:', err);
          }
        }
      } else if (typeof conn.updateBlock === 'function') {
        // نسخ بديلة
        await conn.updateBlock(m.sender, true);
      } else {
        console.warn('قبل: لم أجد دالة صالحة للحظر في conn.');
      }
    } catch (err) {
      console.error('قبل: خطأ أثناء محاولة الحظر:', err);
    }

    // بعد الحظر نوقف معالجة الرسالة
    return true;
  } catch (err) {
    console.error('قبل: خطأ غير متوقع:', err);
    // في حال حدوث خطأ غير متوقع، لا نكسر عمل البوت في المجموعات أو بشكل عام:
    return false;
  }
}