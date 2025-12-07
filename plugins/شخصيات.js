// characters.js — ESM
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia, generateWAMessageFromContent } = pkg

// === الشخصيات: 3 قوائم × 8 شخصيات = 24 (هيناتا محذوفة) ===
const groups = {
  main: [
    { id: 'list1', name: 'القائمة 1' },
    { id: 'list2', name: 'القائمة 2' },
    { id: 'list3', name: 'القائمة 3' }
  ],

  // القائمة 1 (8)
  list1: [
    { name: 'ساسكي', emoji: '🗡️', command: 'sasuke', image: 'https://files.catbox.moe/ziws8j.jpg' },
    { name: 'ناروتو', emoji: '🍥', command: 'naruto', image: 'https://files.catbox.moe/57nt4f.jpg' },
    { name: 'ساغيري', emoji: '🎀', command: 'sagiri', image: 'https://files.catbox.moe/wo4zhx.jpg' },
    { name: 'نيزوكو', emoji: '🎋', command: 'nezuko', image: 'https://files.catbox.moe/ziws8j.jpg' },
    { name: 'ساكورا', emoji: '🌸', command: 'sakura', image: 'https://files.catbox.moe/57nt4f.jpg' },
    { name: 'ميناتو', emoji: '⚡', command: 'minato', image: 'https://files.catbox.moe/wo4zhx.jpg' },
    { name: 'مادارا', emoji: '🔥', command: 'madara', image: 'https://files.catbox.moe/ziws8j.jpg' },
    { name: 'كوتوري', emoji: '🐦', command: 'kotori', image: 'https://files.catbox.moe/57nt4f.jpg' }
  ],

  // القائمة 2 (8) — هيناتا محذوفة، ووضعت "نوبارا" كبديل
  list2: [
    { name: 'كاغورا', emoji: '🎐', command: 'kagura', image: 'https://files.catbox.moe/wo4zhx.jpg' },
    { name: 'كاغا', emoji: '💥', command: 'kaga', image: 'https://files.catbox.moe/ziws8j.jpg' },
    { name: 'ايتوري', emoji: '🐦', command: 'itori', image: 'https://files.catbox.moe/57nt4f.jpg' },
    { name: 'ايتاشي', emoji: '🌑', command: 'itachi', image: 'https://files.catbox.moe/wo4zhx.jpg' },
    { name: 'ايسوزي', emoji: '🌀', command: 'isuzu', image: 'https://files.catbox.moe/ziws8j.jpg' },
    { name: 'اينوري', emoji: '🎤', command: 'inori', image: 'https://files.catbox.moe/57nt4f.jpg' },
    { name: 'هيستيا', emoji: '✨', command: 'hestia', image: 'https://files.catbox.moe/wo4zhx.jpg' },
    { name: 'نوبارا', emoji: '🪄', command: 'nobara', image: 'https://files.catbox.moe/ziws8j.jpg' }
  ],

  // القائمة 3 (8)
  list3: [
    { name: 'ايرزا', emoji: '🔥', command: 'erza', image: 'https://files.catbox.moe/57nt4f.jpg' },
    { name: 'ايميليا', emoji: '❄️', command: 'emilia', image: 'https://files.catbox.moe/wo4zhx.jpg' },
    { name: 'ايلاينا', emoji: '🌙', command: 'elaina', image: 'https://files.catbox.moe/ziws8j.jpg' },
    { name: 'ايبا', emoji: '🎴', command: 'eba', image: 'https://files.catbox.moe/57nt4f.jpg' },
    { name: 'ديدرا', emoji: '💀', command: 'deidara', image: 'https://files.catbox.moe/wo4zhx.jpg' },
    { name: 'كوسبلاي', emoji: '🎭', command: 'cosplay', image: 'https://files.catbox.moe/ziws8j.jpg' },
    { name: 'شيهو', emoji: '🌸', command: 'chiho', image: 'https://files.catbox.moe/57nt4f.jpg' },
    { name: 'ميكو', emoji: '🎤', command: 'miku', image: 'https://files.catbox.moe/wo4zhx.jpg' }
  ]
}

// صورة افتراضية لو فشل شيء
const DEFAULT_IMG = 'https://files.catbox.moe/wo4zhx.jpg'

// مساعدة لبناء صفوف للـ listMessage
function rowsFromGroup(arr, usedPrefix) {
  return arr.map(x => ({ title: `${x.emoji || ''} ${x.name}`, id: `${usedPrefix}${x.command}`, description: `اضغط لعرض صورة ${x.name}` }))
}

function mainRows(usedPrefix) {
  return groups.main.map(g => ({ title: g.name, id: `${usedPrefix}${g.id}`, description: 'افتح القائمة' }))
}

// إرسال listMessage مع fallback نصي
async function sendList(conn, chatId, title, buttonText, sections, quoted) {
  const listMsg = { title, text: 'اختر من القائمة', footer: 'Arthur Bot ⚡', buttonText: buttonText || 'اختر', sections }
  try {
    await conn.sendMessage(chatId, { listMessage: listMsg }, { quoted })
  } catch (e) {
    // fallback نصي يطبع ids
    try {
      const fallback = `${title}\n\n` + sections.flatMap(s => s.rows.map(r => `${r.title} → اكتب: ${r.id}`)).join('\n')
      await conn.sendMessage(chatId, { text: fallback }, { quoted })
    } catch {}
  }
}

// إرسال صورة الشخصية مع تعدد طرق الإرسال (زيادة المتانة)
async function sendCharacterImage(conn, m, character) {
  const url = character.image || DEFAULT_IMG
  const caption = `✦ ${character.name}`
  // محاولة مباشرة (sendMessage image url)
  try {
    await conn.sendMessage(m.chat, { image: { url }, caption }, { quoted: m })
    return
  } catch (err1) {
    conn.logger && conn.logger.warn && conn.logger.warn('image(url) failed — trying prepareWAMessageMedia', err1.message || err1)
  }
  // محاولة عبر prepareWAMessageMedia + generateWAMessageFromContent
  try {
    const media = await prepareWAMessageMedia({ image: { url } }, { upload: conn.waUploadToServer })
    const template = {
      hydratedTemplate: {
        hydratedContentText: caption,
        imageMessage: media.imageMessage,
        hydratedFooterText: 'Arthur Bot ⚡',
        hydratedButtons: []
      }
    }
    const msg = generateWAMessageFromContent(m.chat, { templateMessage: template }, { userJid: (conn.user && conn.user.jid) })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key && msg.key.id })
    return
  } catch (err2) {
    conn.logger && conn.logger.error && conn.logger.error('prepareWAMessageMedia failed — fallback to link', err2.message || err2)
  }
  // fallback أخير: نص مع رابط الصورة
  try {
    await conn.sendMessage(m.chat, { text: `صورة ${character.name}: ${url}` }, { quoted: m })
  } catch {}
}

// helper لإظهار الأخطاء بالقليل من الحذر
function escapeRegExp(string = '') {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// بناء لائحة أوامر مقبولة
const allCommands = [
  'شخصيات',
  'list1', 'list2', 'list3',
  ...groups.list1.map(c => c.command),
  ...groups.list2.map(c => c.command),
  ...groups.list3.map(c => c.command)
]

// الـ handler الفعلي
const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    if (!usedPrefix) usedPrefix = '.'
    const cmd = (command || '').toString().trim()

    // 1) طلب القائمة الرئيسية
    if (/^شخصيات$/i.test(cmd)) {
      const sections = [{ title: 'القوائم', rows: mainRows(usedPrefix) }]
      return await sendList(conn, m.chat, '✨ قوائم الشخصيات ✨', 'فتح القوائم', sections, m)
    }

    // 2) فتح قائمة فرعية
    if (new RegExp(`^${escapeRegExp(usedPrefix)}?list1$`, 'i').test(cmd) || /^list1$/i.test(cmd)) {
      const rows = rowsFromGroup(groups.list1, usedPrefix)
      return await sendList(conn, m.chat, 'قائمة 1 — اختر شخصية', 'عرض الشخصيات', [{ title: 'شخصيات', rows }], m)
    }
    if (new RegExp(`^${escapeRegExp(usedPrefix)}?list2$`, 'i').test(cmd) || /^list2$/i.test(cmd)) {
      const rows = rowsFromGroup(groups.list2, usedPrefix)
      return await sendList(conn, m.chat, 'قائمة 2 — اختر شخصية', 'عرض الشخصيات', [{ title: 'شخصيات', rows }], m)
    }
    if (new RegExp(`^${escapeRegExp(usedPrefix)}?list3$`, 'i').test(cmd) || /^list3$/i.test(cmd)) {
      const rows = rowsFromGroup(groups.list3, usedPrefix)
      return await sendList(conn, m.chat, 'قائمة 3 — اختر شخصية', 'عرض الشخصيات', [{ title: 'شخصيات', rows }], m)
    }

    // 3) زر اختيار شخصية (مثلاً .sasuke) — يرسل صورتها
    let cmdNoPrefix = cmd.replace(new RegExp(`^${escapeRegExp(usedPrefix)}`), '')
    const allChars = [...groups.list1, ...groups.list2, ...groups.list3]
    const found = allChars.find(ch => ch.command.toLowerCase() === cmdNoPrefix.toLowerCase())
    if (found) {
      return await sendCharacterImage(conn, m, found)
    }

    // 4) أي شيء آخر: نعيد القائمة الرئيسية احتياطاً
    const sections = [{ title: 'القوائم', rows: mainRows(usedPrefix) }]
    return await sendList(conn, m.chat, '✨ قوائم الشخصيات ✨', 'فتح القوائم', sections, m)
  } catch (err) {
    conn.logger && conn.logger.error && conn.logger.error('characters.js error:', err)
    try { await conn.sendMessage(m.chat, { text: 'حدث خطأ طفيف — اكتب: شخصيات' }, { quoted: m }) } catch {}
  }
}

handler.help = ['شخصيات']
handler.tags = ['anime']
handler.command = new RegExp('^(' + allCommands.map(c => escapeRegExp(c)).join('|') + ')$', 'i')

export default handler