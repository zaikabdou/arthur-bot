// ===[ مضاد اللينكات – النسخة الجبارة – يمسح كل رابط واتساب مهما كان مخفي ]===
// ملف: plugins/antilink.js
// يشتغل مع: .فتح مضاد_اللينكات  |  .قفل مضاد_اللينكات
// يمسح الرسالة فورًا + طرد (إذا البوت أدمن) + رسالة احترافية + لا يطرد المشرفين

const LINK_REGEX = [
  /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i,
  /whatsapp\.com\/channel\/[0-9A-Za-z]{20,24}/i,
  /wa\.me\/[0-9]{5,15}/i,
  /t\.me\/[a-zA-Z0-9_]{5,32}/i,
  /bit\.ly|tinyurl\.com|short\.link|goo\.gl|rebrand\.ly/i
]

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner }) {
  if (!m.isGroup || m.fromMe || isAdmin || isOwner) return true

  const chat = global.db.data.chats[m.chat] || {}
  if (!chat.antiLink && !chat.antiLink2) return true

  const text = m.text || m.caption || ''
  if (!text) return true

  // هل فيه رابط ممنوع؟
  const hasBannedLink = LINK_REGEX.some(regex => regex.test(text))
  if (!hasBannedLink) return true

  // استثناء رابط الجروب نفسه
  if (isBotAdmin) {
    try {
      const inviteCode = await conn.groupInviteCode(m.chat)
      const ownLink = `https://chat.whatsapp.com/${inviteCode}`
      if (text.includes(ownLink)) return true
    } catch {}
  }

  // حذف الرسالة فورًا
  try {
    await conn.sendMessage(m.chat, {
      delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender }
    })
  } catch (e) {
    console.log('فشل حذف الرسالة:', e)
  }

  // رسالة احترافية + منشن
  const warning = `
❍━═━═━═━═━═━═━❍
❍⇇ تم اكتشاف رابط ممنوع
❍
❍⇇ العضو ↜ @${m.sender.split('@')[0]}
❍⇇ النوع  ↜ رابط واتساب/تليجرام/مختصر
❍⇇ الإجراء ↜ تم حذف الرسالة
${isBotAdmin ? '❍⇇ تم الطرد تلقائيًا' : '❍⇇ البوت ليس أدمن → لا يمكنه الطرد'}
❍
❍⇇ مضاد اللينكات مفعّل
❍━═━═━═━═━═━═━❍
  `.trim()

  await conn.sendMessage(m.chat, {
    text: warning,
    mentions: [m.sender]
  }, { quoted: m })

  // طرد إذا البوت أدمن
  if (isBotAdmin) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    } catch (e) {
      console.log('فشل الطرد:', e)
    }
  }

  return true
}