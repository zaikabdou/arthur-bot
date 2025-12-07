// ===[ Mute System 2026 – كتم مؤقت + دائم – بدون سبب – أقوى وأنظف ]===
// ملف: plugins/mute.js
// أوامر:
// .كتم @منشن [الوقت]  → مثال: .كتم @20123456789 10m
// .كتم @منشن          → كتم دائم
// .فككتم @منشن

import fs from 'fs'
import path from 'path'

const MUTES_FILE = path.join(process.cwd(), 'database', 'mutes.json')

// تحميل + حفظ
function loadMutes() {
  try {
    if (!fs.existsSync(MUTES_FILE)) {
      fs.mkdirSync(path.dirname(MUTES_FILE), { recursive: true })
      fs.writeFileSync(MUTES_FILE, JSON.stringify({}, null, 2))
      return {}
    }
    return JSON.parse(fs.readFileSync(MUTES_FILE, 'utf8') || '{}')
  } catch (e) {
    console.error('خطأ تحميل الكتم:', e)
    return {}
  }
}

function saveMutes(data) {
  try {
    fs.mkdirSync(path.dirname(MUTES_FILE), { recursive: true })
    fs.writeFileSync(MUTES_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('خطأ حفظ الكتم:', e)
  }
}

// تنظيف الـ jid
function cleanJid(jid) {
  if (!jid) return null
  if (jid.endsWith('@g.us') || jid.endsWith('@s.whatsapp.net')) return jid
  if (/^\d+$/.test(jid)) return jid + '@s.whatsapp.net'
  return jid
}

// تحويل الوقت: 10s, 5m, 2h, 1d
function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/i)
  if (!match) return null
  const num = parseInt(match[1])
  const unit = match[2].toLowerCase()
  return num * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit]
}

// تنسيق الوقت المتبقي
function formatTime(ms) {
  if (ms < 60000) return `${(ms / 1000).toFixed(0)} ثانية`
  if (ms < 3600000) return `${(ms / 60000).toFixed(0)} دقيقة`
  if (ms < 86400000) return `${(ms / 3600000).toFixed(0)} ساعة`
  return `${(ms / 86400000).toFixed(0)} يوم`
}

// تهيئة + مزامنة
if (!global.db) global.db = { data: { users: {} } }
if (!global.db.data.users) global.db.data.users = {}

const saved = loadMutes()
for (const jid in saved) {
  if (!global.db.data.users[jid]) global.db.data.users[jid] = {}
  global.db.data.users[jid].muted = !!saved[jid].muted
  global.db.data.users[jid].mutedUntil = saved[jid].mutedUntil || null
}

function saveAll() {
  const data = {}
  for (const jid in global.db.data.users) {
    const u = global.db.data.users[jid]
    if (u.muted || u.mutedUntil) {
      data[jid] = { muted: !!u.muted, mutedUntil: u.mutedUntil || null }
    }
  }
  saveMutes(data)
}

// =================== الأوامر ===================
export default {
  help: ['كتم', 'فككتم'],
  tags: ['group'],
  command: /^(كتم|فككتم|فك-كتم|unmute)$/i,
  group: true,
  admin: true,
  botAdmin: true,

  async handler(m, { conn, text, usedPrefix, command }) {
    if (!m.isGroup) return m.reply('الأمر للجروبات فقط')

    let who = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
    if (!who && text) who = text.split(' ')[0]
    if (!who) return m.reply(`منشن الشخص أو ارده\nمثال: ${usedPrefix}كتم @منشن 10m`)

    who = cleanJid(who)
    const owner = global.owner?.[0]?.[0] ? global.owner[0][0] + '@s.whatsapp.net' : null
    const bot = conn.user.jid

    if (who === owner) return m.reply('ما أقدر أكتم الأونر')
    if (who === bot) return m.reply('ما أقدر أكتم نفسي')

    if (!global.db.data.users[who]) global.db.data.users[who] = { muted: false, mutedUntil: null }
    const user = global.db.data.users[who]

    // فك الكتم
    if (/^فككتم|فك-كتم|unmute$/i.test(command)) {
      if (!user.muted && !user.mutedUntil) return m.reply('هذا الشخص مو مكتوم')

      user.muted = false
      user.mutedUntil = null
      saveAll()

      await m.reply(`
تم فك كتم العضو بنجاح

الشخص: @${who.split('@')[0]}
المشرف: @${m.sender.split('@')[0]}
      `.trim(), { mentions: [who, m.sender] })

      return
    }

    // كتم
    if (command === 'كتم') {
      if (user.muted || user.mutedUntil) return m.reply('هذا الشخص مكتوم من قبل')

      const timeArg = text.split(' ')[1]
      const duration = timeArg ? parseDuration(timeArg) : null
      const until = duration ? Date.now() + duration : null
      const timeText = duration ? `لمدة ${formatTime(duration)}` : 'نهائيًا'

      user.muted = true
      user.mutedUntil = until
      saveAll()

      await conn.sendMessage(m.chat, {
        text: `
تم كتم العضو بنجاح

الشخص: @${who.split('@')[0]}
المدة: ${timeText}
المشرف: @${m.sender.split('@')[0]}
        `.trim(),
        mentions: [who, m.sender]
      }, { quoted: m })
    }
  },

  // فلتر حذف الرسائل + فك الكتم التلقائي
  async before(m, { conn }) {
    if (!m.isGroup || !m.key || m.fromMe || m.isBaileys) return true

    const sender = cleanJid(m.sender)
    if (!sender) return true

    const user = global.db.data.users[sender]
    if (!user) return true

    // فك الكتم تلقائيًا
    if (user.mutedUntil && Date.now() > user.mutedUntil) {
      user.muted = false
      user.mutedUntil = null
      saveAll()

      await conn.sendMessage(m.chat, {
        text: `انتهى كتم @${sender.split('@')[0]} تلقائيًا`,
        mentions: [sender]
      }).catch(() => {})
    }

    if (user.muted || user.mutedUntil) {
      try {
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: sender
          }
        })
      } catch (e) {
        console.log('فشل حذف رسالة المكتوم:', e)
      }
      return true
    }

    return true
  }
}