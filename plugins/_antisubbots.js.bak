// ===[ AntiBot + DetectBot Ultimate 2026 - مُحسّن للعمل مع تفعيلاتك ]===
// ملف: plugins/antibot.js
// يطرد البوتات + يكشف أي رقم عليه بوت شغال (حتى لو مقفول أو ما يرد)
// يشتغل مع تفعيلات: chat.antiBot و chat.detect أو chat.detectBot
// يستدعى عبر: export async function before(m, { conn, participants, isBotAdmin, is
import { areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { conn, participants = [], isBotAdmin = false, isAdmin = false, isOwner = false }) {
  try {
    if (!m.isGroup || m.fromMe || m.isBaileys) return true

    const chat = (global.db?.data?.chats?.[m.chat]) || {}
    // دعم لعدة أسماء ممكنة للإعدادات حتى لو handler عندك استعمل detect أو detectBot
    const enableAntiBot = !!(chat.antiBot)
    const enableDetectBot = !!(chat.detectBot || chat.detect)

    if (!enableAntiBot && !enableDetectBot) return true

    // تحديد البوت الرئيسي بأكثر من طريقة
    const mainBotJid = (conn?.user?.jid) || (global.conn?.user?.jid) || (Array.isArray(global.owner) && global.owner[0] && global.owner[0][0] && `${global.owner[0][0]}@s.whatsapp.net`) || null
    if (mainBotJid && areJidsSameUser(m.sender, mainBotJid)) return true

    // لو هذا مش البوت الرئيسي ووجَد الرئيسي ضمن المشاركين -> انسحاب اختياري
    if (mainBotJid && !areJidsSameUser(conn.user?.jid, mainBotJid) &&
        Array.isArray(participants) && participants.some(p => areJidsSameUser(p.id, mainBotJid))) {
      if (enableAntiBot && typeof conn.groupLeave === 'function') {
        setTimeout(() => conn.groupLeave(m.chat).catch(()=>{}), 4000)
      }
      return true
    }

    // هل يقدر البوت يطرد؟
    const canKick = mainBotJid && areJidsSameUser(conn.user?.jid, mainBotJid) && !!isBotAdmin

    let detected = false
    let reason = ''

    // === 1 === كشف Baileys ID (نمط 3EB0...)
    const isBaileysID = typeof m.key?.id === 'string' && m.key.id.startsWith('3EB0') && m.key.id.length === 22

    // === 2 === كشف عبر messageStubType (بعض القيم التقنية)
    const baileysStubs = [68, 87, 91, 92, 94]
    const isBaileysStub = typeof m.messageStubType === 'number' && baileysStubs.includes(m.messageStubType)

    // === 3 === سلوك آلي مشبوه — تحليل سريع
    if (!global.antiBotDB) global.antiBotDB = {}
    const db = global.antiBotDB[m.chat] = global.antiBotDB[m.chat] || {}
    const user = db[m.sender] = db[m.sender] || { msgs: [], last: 0, instant: 0 }

    const now = Date.now()
    const timeDiff = now - (user.last || 0)
    const textRaw = (m.text || m.caption || m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || '').toString()
    const text = textRaw.toLowerCase()
    const hasPrefix = /^[\.\!\*\#\-\_\/\|]/.test(text.trim())

    user.msgs.push({ text: textRaw, time: now })
    if (user.msgs.length > 12) user.msgs.shift()
    user.last = now

    if (timeDiff > 0 && timeDiff < 400) user.instant = (user.instant || 0) + 1
    else user.instant = 0

    const last5 = user.msgs.slice(-5).map(x => (x.text || '').toString())
    const unique5 = [...new Set(last5)]

    const sameFormat = user.msgs.slice(-6).map(x => {
      const t = (x.text || '').toString()
      const lines = t.split('\n').length
      const emojis = (t.match(/\p{Emoji}/gu) || []).length
      return `${lines}-${emojis}`
    })
    const uniqueFormat = [...new Set(sameFormat)]

    const isSuspiciousBehavior =
      (user.instant > 5) ||
      hasPrefix ||
      (last5.length >= 5 && unique5.length <= 2) ||
      (sameFormat.length >= 6 && uniqueFormat.length <= 2)

    // تحديد النتيجة النهائية
    if (isBaileysID) {
      detected = true
      reason = 'بوت Baileys مكشوف (3EB0 ID)'
    } else if (isBaileysStub) {
      detected = true
      reason = `بوت شغال حاليًا (بصمة تقنية: ${m.messageStubType})`
    } else if (isSuspiciousBehavior) {
      detected = true
      reason = 'سلوك آلي مشبوه (رد فوري + نمط ثابت)'
    }

    if (detected) {
      const name = (typeof conn.getName === 'function' ? await conn.getName(m.sender).catch(()=>null) : null) || m.sender.split('@')[0]

      const caption = `
❍━═━═━═━═━═━═━❍
❍⇇ تم اكتشاف بوت في المجموعة
❍
❍⇇ الاسم ↜ ${name}
❍⇇ الرقم ↜ ${m.sender.split('@')[0]}
❍⇇ السبب ↜ ${reason}
❍⇇ ملاحظة ↜ البوت الوحيد المسموح: أنا فقط
❍━═━═━═━═━═━═━❍
      `.trim()

      try {
        await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender] })
      } catch (e) {
        console.error('antibot: failed to send alert:', e?.message || e)
      }

      if (enableAntiBot && canKick) {
        try {
          // محاولة حذف الرسالة (إن كانت الواجهة تدعم delete)
          try {
            if (typeof conn.sendMessage === 'function') {
              await conn.sendMessage(m.chat, {
                delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender }
              }).catch(()=>{})
            }
          } catch {}

          // محاولة الطرد
          if (typeof conn.groupParticipantsUpdate === 'function') {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            await conn.sendMessage(m.chat, { text: `✅ تم طرد البوت بنجاح — الجروب آمن الآن` })
          } else {
            await conn.sendMessage(m.chat, { text: `⚠️ تم الكشف عن بوت لكن الواجهة لا تدعم الطرد التلقائي.` })
          }

          // تنظيف سجل المستخدم من DB التحليلي
          if (db && db[m.sender]) delete db[m.sender]
        } catch (e) {
          console.error('antibot: kick failed:', e?.message || e)
        }
      }
    }

    return true
  } catch (err) {
    console.error('antibot before error:', err)
    return true
  }
}