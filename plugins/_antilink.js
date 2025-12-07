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
  try {
    // تجاهل خارج الجروب، أو من البوت نفسه، أو من الادمن/المطور
    if (!m.isGroup || m.fromMe || isAdmin || isOwner) return true

    const chat = global.db?.data?.chats?.[m.chat] || {}
    if (!chat.antiLink && !chat.antiLink2) return true

    // استخراج نص الرسالة بطريقة أكثر موثوقية
    const text = (
      m.text ||
      m.caption ||
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      ''
    ).toString()

    if (!text) return true

    // هل فيه رابط ممنوع؟
    const hasBannedLink = LINK_REGEX.some(regex => regex.test(text))
    if (!hasBannedLink) return true

    // استثناء: رابط الجروب نفسه (لو نقدر نستخرج invite)
    if (isBotAdmin) {
      try {
        if (typeof conn.groupInviteCode === 'function') {
          const inviteCode = await conn.groupInviteCode(m.chat)
          const ownLink = `https://chat.whatsapp.com/${inviteCode}`
          if (text.includes(ownLink)) return true
        } else if (typeof conn.groupMetadata === 'function') {
          // بديل: بعض النسخ توفر metadata مع inviteCode
          const meta = await conn.groupMetadata(m.chat).catch(() => null)
          const ownLink = meta?.inviteCode ? `https://chat.whatsapp.com/${meta.inviteCode}` : null
          if (ownLink && text.includes(ownLink)) return true
        }
      } catch (e) {
        // لو فشل الحصول على كود الدعوة، نستمر عادي (عدم منع السلوك)
        console.log('antilink: failed to check own invite link:', e?.message || e)
      }
    }

    // محاولة حذف الرسالة فورًا (لو الواجهة تدعم ذلك)
    try {
      if (typeof conn.sendMessage === 'function') {
        await conn.sendMessage(m.chat, {
          delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender }
        }).catch(() => { /* بعض نسخ Baileys قد لا تدعم هذا الشكل */ })
      }
    } catch (e) {
      console.log('فشل حذف الرسالة:', e?.message || e)
    }

    // رسالة تحذير احترافية مع منشن
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

    try {
      await conn.sendMessage(m.chat, {
        text: warning,
        mentions: [m.sender]
      }, { quoted: m })
    } catch (e) {
      console.log('antilink: failed to send warning msg:', e?.message || e)
    }

    // طرد إذا البوت أدمن (وتأكد من توفر الدالة)
    if (isBotAdmin && typeof conn.groupParticipantsUpdate === 'function') {
      try {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      } catch (e) {
        console.log('فشل الطرد:', e?.message || e)
      }
    }

    return true
  } catch (err) {
    console.error('antilink before error:', err)
    return true
  }
}