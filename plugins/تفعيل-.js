const المطورين = ['213551217759', '213773231685'];

const no = (jid) => (jid || '').toString().replace(/[^0-9]/g, '');

const handler = async (m, { conn, usedPrefix, command, args }) => {
  const الرقم = no(m.sender);

  if (!المطورين.includes(الرقم)) {
    return m.reply('⚠️ هذا الأمر مخصص للمطور فقط.');
  }

  // تأكد من وجود بنية الإعدادات
  global.db = global.db || {};
  global.db.data = global.db.data || {};
  global.db.data.settings = global.db.data.settings || {};
  const bot = global.db.data.settings[conn.user.jid] || {};
  global.db.data.settings[conn.user.jid] = bot;

  const تشغيل = /عمل|شغل|تشغيل/i.test(command);
  const ايقاف = /وقف|تعطيل|ايقاف/i.test(command);

  if (تشغيل) {
    bot.antiPrivate = true;
    await m.reply(`✅ تم تشغيل مضاد الخاص بنجاح.\nالآن سيتم حظر أي شخص يرسل في الخاص (حتى لو أرسل نقطة).`);
  } else if (ايقاف) {
    bot.antiPrivate = false;
    await m.reply(`🚫 تم إيقاف مضاد الخاص.\nالآن يمكن للجميع التحدث في الخاص.`);
  } else {
    await m.reply(`❗ استخدم الأوامر التالية:\n\n${usedPrefix}عمل-مضاد-الخاص لتشغيل\n${usedPrefix}وقف-مضاد-الخاص لإيقاف`);
  }
};

handler.help = ['عمل-مضاد-الخاص', 'وقف-مضاد-الخاص'];
handler.tags = ['owner'];
handler.command = /^(عمل-مضاد-الخاص|وقف-مضاد-الخاص)$/i;

export default handler;

/**
 * before: معالج يفعل الحظر التلقائي على كل رسالة خاصة
 * يُستدعى عادة عبر نظام الميدل وير قبل معالجة الرسائل الأخرى.
 */
export async function before(m, { conn }) {
  try {
    // تأكد من وجود إعدادات البوت
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.settings = global.db.data.settings || {};
    const bot = global.db.data.settings[conn.user.jid] || {};

    // إذا المضاد مُطفأ، لا نفعل شيئاً
    if (!bot.antiPrivate) return true;

    // تجاهل المجموعات
    const remote = m.key && m.key.remoteJid ? m.key.remoteJid : '';
    if (/@g\.us$/.test(remote)) return true;

    // تجاهل رسائل البوت نفسه أو رسائل من النظام
    if (m.key && m.key.fromMe) return true;
    if (!m.sender) return true;

    // استثناء المطورين
    const senderNo = no(m.sender);
    if (المطورين.includes(senderNo)) return true;

    // احظر المرسل فوراً - لا نرسل رد لكي لا يعلموه (صامت)
    try {
      // بعض إصدارات المكتبات تقبل 'block' أو true؛ هذا شائع في Baileys:
      if (typeof conn.updateBlockStatus === 'function') {
        await conn.updateBlockStatus(m.sender, 'block');
      } else if (typeof conn.updateBlock === 'function') {
        await conn.updateBlock(m.sender, true);
      } else {
        console.warn('دالة الحظر غير موجودة في conn، تحقق من واجهة المكتبة.');
      }
      console.log(`[antiPrivate] تم حظر ${m.sender}`);
    } catch (e) {
      console.error('[antiPrivate] خطأ عند محاولة الحظر:', e);
    }

    // أوقف معالجة هذه الرسالة (اختياري) — نعيد true للسماح بإكمال السريان إن أردت
    return true;
  } catch (err) {
    console.error('before(antiPrivate) error:', err);
    return true;
  }
}