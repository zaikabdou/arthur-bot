// ===[ Characters Plugin - ES Modules (مُصلّح) ]===
// ملف: plugins/characters.js
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// === البيانات ===
const groups = {
  main: [
    { id: 'list1', name: 'القائمة 1', emoji: '📜' },
    { id: 'list2', name: 'القائمة 2', emoji: '📚' },
    { id: 'list3', name: 'القائمة 3', emoji: '📖' }
  ],
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

const DEFAULT_IMG = 'https://files.catbox.moe/wo4zhx.jpg'

// === Helpers ===
function rowsFromGroup(arr, usedPrefix = '.') {
  return arr.map(x => ({
    title: `\( {x.emoji || ''} \){x.name}`,
    rowId: `\( {usedPrefix} \){x.command}`,
    description: `اضغط لعرض صورة ${x.name}`
  }))
}

function mainRows(usedPrefix = '.') {
  return groups.main.map(g => ({
    title: `\( {g.emoji} \){g.name}`,
    rowId: `\( {usedPrefix} \){g.id}`,
    description: 'افتح القائمة'
  }))
}

async function sendList(conn, chatId, title, buttonText, sections, quoted) {
  const listMsg = {
    title,
    description: 'اختر من القائمة',
    buttonText: buttonText || 'اختر',
    footerText: 'Arthur Bot ⚡',
    sections
  }
  try {
    await conn.sendMessage(chatId, { listMessage: listMsg }, { quoted })
  } catch (e) {
    console.error(`sendList failed at ${new Date().toISOString()}:`, e?.message || e)
    // fallback نصي بسيط
    try {
      const fallback = `${title}\n\n` + sections.flatMap(s =>
        s.rows.map(r => `\( {r.title} → اكتب: \){r.rowId}`)
      ).join('\n')
      await conn.sendMessage(chatId, { text: fallback }, { quoted })
    } catch (e2) { console.error(`sendList fallback failed:`, e2?.message || e2) }
  }
}

async function sendMainInteractive(conn, m, usedPrefix = '.') {
  const headerTitle = '✨ قوائم الشخصيات ✨'
  const bodyText = `مرحباً ${m.pushName || ''}!\n\nاختر قائمة الشخصيات من الأزرار أدناه 👇`
  const footerText = 'Arthur Bot ⚡'

  // Buttons كـ templateButtons (مُصحح لـ Baileys الحديثة)
  const templateButtons = groups.main.map(g => ({
    index: groups.main.indexOf(g) + 1,  // index مطلوب
    urlButton: {  // استخدم urlButton كـ fallback لو buttons مش مدعومة، بس هنا quickReply
      displayText: `\( {g.emoji} \){g.name}`,
      id: `\( {usedPrefix} \){g.id}`  // call button بدل url
    }
  }))

  // send with image + buttons (مُحسن)
  try {
    // جرب أولًا image مباشرة (أسرع في Baileys 6+)
    await conn.sendMessage(m.chat, {
      image: { url: DEFAULT_IMG },
      caption: bodyText,
      footer: footerText,
      templateButtons: templateButtons,  // مُغير من buttons إلى templateButtons
      headerType: 4  // للصورة
    }, { quoted: m })
    return
  } catch (e1) {
    console.warn('Direct image+buttons failed:', e1?.message || e1)
  }

  // fallback: prepareWAMessageMedia
  try {
    const media = await prepareWAMessageMedia({ image: { url: DEFAULT_IMG } }, { upload: conn.waUploadToServer })
    await conn.sendMessage(m.chat, {
      image: media.imageMessage,
      caption: bodyText,
      footer: footerText,
      templateButtons: templateButtons,
      headerType: 4
    }, { quoted: m })
    return
  } catch (e2) {
    console.error('prepareWAMessageMedia failed:', e2?.message || e2)
  }

  // final fallback: text only
  try {
    await conn.sendMessage(m.chat, { text: bodyText + '\n\n' + templateButtons.map(b => b.urlButton.displayText + ' → ' + b.urlButton.id).join('\n') }, { quoted: m })
  } catch (err) {
    console.error('sendMainInteractive final fallback failed:', err?.message || err)
  }
}

async function sendCharacterImage(conn, m, character) {
  const url = character.image || DEFAULT_IMG
  const caption = `✦ \( {character.emoji || ''} \){character.name}\n\nصورة جميلة لـ ${character.name}!`
  try {
    // جرب أولًا image مباشرة (أفضل في الحديثة)
    await conn.sendMessage(m.chat, { image: { url }, caption }, { quoted: m })
    return
  } catch (err1) {
    console.warn(`Direct image failed for ${character.name}:`, err1?.message || err1)
  }

  try {
    const media = await prepareWAMessageMedia({ image: { url } }, { upload: conn.waUploadToServer })
    await conn.sendMessage(m.chat, {
      image: media.imageMessage,
      caption
    }, { quoted: m })
    return
  } catch (err2) {
    console.error(`prepareWAMessageMedia failed for ${character.name}:`, err2?.message || err2)
  }

  // final fallback
  try {
    await conn.sendMessage(m.chat, { text: `صورة \( {character.name}: \){url}` }, { quoted: m })
  } catch (e) { 
    console.error(`Final fallback failed for ${character.name}:`, e?.message || e) 
  }
}

// escape helper
function escapeRegExp(string = '') {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// build accepted commands list (without prefix)
const allCommands = [
  'شخصيات',
  'list1', 'list2', 'list3',
  ...groups.list1.map(c => c.command),
  ...groups.list2.map(c => c.command),
  ...groups.list3.map(c => c.command)
]

export default {
  tags: ['anime'],
  command: new RegExp('^(' + allCommands.map(c => escapeRegExp(c)).join('|') + ')$', 'i'),
  group: false,

  async handler(m, { conn, usedPrefix = '.', command }) {
    try {
      // مُصحح: command قد يكون array من RegExp match، خذ الأول
      const cmd = (Array.isArray(command) ? command[0] : command || '').toLowerCase().trim()
      
      // 1) القائمة الرئيسية
      if (/^شخصيات$/i.test(cmd)) {
        return await sendMainInteractive(conn, m, usedPrefix)
      }

      // 2) القوائم الفرعية list1|list2|list3
      const listKey = ['list1', 'list2', 'list3'].find(k => k.toLowerCase() === cmd)
      if (listKey) {
        const listGroup = groups[listKey]
        const listName = groups.main.find(g => g.id === listKey)?.name || `قائمة ${listKey.replace('list', '')}`
        const rows = rowsFromGroup(listGroup, usedPrefix)
        const sections = [{ title: 'شخصيات', rows }]
        return await sendList(conn, m.chat, `${listName} — اختر شخصية`, 'عرض الشخصيات', sections, m)
      }

      // 3) أوامر الصور (مثلاً sasuke)
      const allChars = [...groups.list1, ...groups.list2, ...groups.list3]
      const found = allChars.find(ch => ch.command.toLowerCase() === cmd)
      if (found) {
        return await sendCharacterImage(conn, m, found)
      }

      // 4) fallback: عرض القائمة الرئيسية
      return await sendMainInteractive(conn, m, usedPrefix)
    } catch (err) {
      console.error(`characters.js error at ${new Date().toISOString()}:`, err)
      try {
        await conn.sendMessage(m.chat, { text: 'حدث خطأ طفيف — اكتب: .شخصيات' }, { quoted: m })
      } catch {}
    }
  }
}