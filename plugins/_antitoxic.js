// ===[ مضاد الشتائم – النسخة الجبارة – طرد بعد 3 تحذيرات فقط ]===
// ملف: plugins/antitoxic.js
// يشتغل مع: .فتح مضاد_الشتائم  |  .قفل مضاد_الشتائم

import axios from 'axios'

const TOXIC_WORDS = /(كسمك|كس|زب|نيك|متناك|خول|شرموطه|لبوه|عرص|قحبة|منيوك|زبي|طيز|كساسك|كسختك|كس امك|زب امك|شرموط|قحبه|منيك|يا ابن الشرموطة|يا ابن القحبة|يا عاهرة|يا لبوة|يا عرصة|يا ابن الحرام|يا ولد الزنا|كسخت|زبك في|طيزك|مني|لبنك|كساس|قواد|مأبون|خرا عليك|خرا على|منيك امك|نيج امك|شرموطة امك|قحبة امك|خول امك)/i

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  if (!m.isGroup) return true

  const chat = global.db.data.chats[m.chat] || {}
  if (!chat.antiToxic) return true

  const text = m.text || m.caption || ''
  if (!text) return true

  if (TOXIC_WORDS.test(text)) {
    // تهيئة التحذيرات
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { warn: 0 }
    const user = global.db.data.users[m.sender]
    user.warn = (user.warn || 0) + 1

    // حذف الرسالة
    try {
      await conn.sendMessage(m.chat, {
        delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender }
      })
    } catch (e) {}

    const warnCount = user.warn

    const warning = `
❍━═━═━═━═━═━═━❍
❍⇇ تم اكتشاف شتيمة
❍
❍⇇ العضو ↜ @${m.sender.split('@')[0]}
❍⇇ التحذير ↜ ${warnCount}/3
${warnCount >= 3 ? '❍⇇ تم الطرد تلقائيًا' : '❍⇇ احترم الجروب'}
❍━═━═━═━═━═━═━❍
    `.trim()

    await conn.sendMessage(m.chat, {
      text: warning,
      mentions: [m.sender]
    }, { quoted: m })

    // طرد بعد 3 تحذيرات (إذا البوت أدمن ومش أدمن اللي سب)
    if (warnCount >= 3 && isBotAdmin && !isAdmin) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        await conn.sendMessage(m.chat, {
          text: 'تم طرد العضو نهائيًا بسبب الشتائم المتكررة'
        })
        user.warn = 0 // تصفير بعد الطرد
      } catch (e) {
        console.log('فشل الطرد:', e)
      }
    }
  }

  return true
}