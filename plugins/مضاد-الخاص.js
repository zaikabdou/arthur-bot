export async function before(m, { conn }) {
  // تجاهل رسائل البوت نفسه
  if (m.isBaileys && m.fromMe) return true;

  // تجاهل رسائل المجموعات
  if (m.isGroup) return false;

  // إذا الرسالة فارغة أو ليس فيها نص
  if (!m.message || !m.text) return true;

  // السماح بكلمات محددة
  const allowedWords = ['PIEDRA', 'PAPEL', 'TIJERA', 'serbot', 'jadibot'];
  if (allowedWords.some(w => m.text.includes(w))) return true;

  // بيانات البوت
  const botSettings = global.db.data.settings[conn.user.jid] || {};
  
  // أرقام المطورين المستثناة
  const developers = ['213551217759', '213773231685'];
  const senderNumber = m.sender.replace(/[^0-9]/g, '');

  // التحقق من تفعيل الحظر للخاص
  if (botSettings.antiPrivate) {
    if (!developers.includes(senderNumber)) {
      // إرسال تحذير
      await m.reply(
        `*_⊱─═⪨༻𓆩〘⚡〙𓆪༺⪩═─⊰_*\n` +
        `*❪🌪❫:•⪼ ممنوع الكلام في الخاص لذالك سوف يتم حظرك*\n` +
        `*┊🌩┊:•⪼ للتواصل مع المطور⇇❪ https://wa.me/213551217759 ❫*\n` +
        `*_⊱─═⪨༻𓆩〘⚡〙𓆪༺⪩═─⊰_*\n` +
        `*┊🌩┊:•⪼ تـفـضل لـي الانـضمـام الـى مـجـموعـه الـبـوت 👑🌹*\n` +
        `*_مـمـنوع الاسـتـخـدام خـاص_\n` +
        `*_مجموعتي علا الواتساب لي يشتغل البوت_*\n` +
        `https://chat.whatsapp.com/GD0B2iL7QZU53PCldoTBBr?mode=hqrt2`,
        false,
        { mentions: [m.sender] }
      );

      // حظر المرسل مباشرة
      await conn.updateBlockStatus(m.sender, 'block');
    }
  }

  return false;
}