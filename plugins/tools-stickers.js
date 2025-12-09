import { sticker, addExif } from '../lib/sticker.js'
import axios from 'axios'
import fetch from 'node-fetch'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const جلبSticker = async (نص, محاولة = 1) => {
  try {
    const res = await axios.get('https://skyzxu-brat.hf.space/brat', { params: { text: نص }, responseType: 'arraybuffer' })
    return res.data
  } catch (e) {
    if (e.response?.status === 429 && محاولة <= 3) {
      const انتظر = e.response.headers['retry-after'] || 5
      await delay(انتظر * 1000)
      return جلبSticker(نص, محاولة + 1)
    }
    throw e
  }
}

const جلبStickerفيديو = async نص => {
  const res = await axios.get('https://skyzxu-brat.hf.space/brat-animated', { params: { text: نص }, responseType: 'arraybuffer' })
  if (!res.data) throw new Error('لم يتم جلب الفيديو.')
  return res.data
}

const handler = async (m, { conn, text, args, command }) => {
  try {
    const user = m.sender
    const uData = global.db.data.users[user] || {}
    const حقوق1 = uData.text1 || 'ستكر'
    const حقوق2 = uData.text2 || 'بوت'

    switch (command) {
      case 'ثابت':
        text = m.quoted?.text || text
        if (!text) return conn.reply(m.chat, '❌ ارسل نص او اقتبس رسالة', m)
        await m.react('🕒')
        const buf = await جلبSticker(text)
        const st = await sticker(buf, false, حقوق1, حقوق2)
        await conn.sendFile(m.chat, st, 'sticker.webp', '', m)
        await m.react('✔️')
        break

      case 'ستكري':
        text = m.quoted?.text || text
        if (!text) return conn.reply(m.chat, '❌ ارسل نص او اقتبس رسالة', m)
        await m.react('🕒')
        const vBuf = await جلبStickerفيديو(text)
        const stv = await sticker(vBuf, null, حقوق1, حقوق2)
        await conn.sendMessage(m.chat, { sticker: stv }, { quoted: m })
        await m.react('✔️')
        break

      case 'تعديل':
        if (!m.quoted) return conn.reply(m.chat, '❌ رد على ستكر لتعديله', m)
        await m.react('🕒')
        const data = await m.quoted.download()
        const [pack, author] = text.split('|').map(p => p.trim())
        const exif = await addExif(data, pack || حقوق1, author || حقوق2)
        await conn.sendMessage(m.chat, { sticker: exif }, { quoted: m })
        await m.react('✔️')
        break
    }
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, `⚠︎ حدث خطأ: ${e.message}`, m)
  }
}

handler.command = ['ثابت', 'ستكري', 'تعديل']
handler.tags = ['ستكر']
handler.help = ['ثابت', 'ستكري', 'تعديل']

export default handler