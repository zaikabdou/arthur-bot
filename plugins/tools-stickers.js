import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
  try {
    const user = m.sender
    const uData = global.db.data.users[user] || {}
    const pack = uData.text1 || 'ستكر'
    const author = uData.text2 || 'بوت'

    switch (command) {

      // ===== بحث ستيكرات ===== //
      case 'ستكري': {
        if (!text) return conn.reply(m.chat, '❌ اكتب كلمة للبحث عن ستيكرات.\nمثال:\n.ستكري اكازا', m)

        await m.react('🕒')

        // API صور مجانية مع نتائج كثيرة
        const url = `https://api.nekobot.xyz/image?type=anime&query=${encodeURIComponent(text)}`
        const res = await fetch(url)
        const json = await res.json()

        if (!json || !json.message) {
          await m.react('✖️')
          return conn.reply(m.chat, '⚠︎ ما حصلت نتائج للكلمة.', m)
        }

        // النتيجة تكون صورة واحدة — فأرسل أكثر من 5 نتائج بالبحث العميق
        const searchUrl = `https://api.waifu.im/search/?included_tags=${encodeURIComponent(text)}`
        const s2 = await fetch(searchUrl)
        const j2 = await s2.json()

        // نجمع نتائج API 1 + API 2 معاً
        const results = [
          json.message,
          ...(j2.images?.map(i => i.url) || [])
        ].slice(0, 8) // حدّ أقصى 8 ستيكرات حتى ما يزعج القروب

        if (!results.length) {
          await m.react('✖️')
          return conn.reply(m.chat, '⚠︎ لم يتم العثور على ستيكرات مناسبة.', m)
        }

        for (const src of results) {
          try {
            const st = await sticker(false, src, pack, author)
            await conn.sendMessage(m.chat, { sticker: st }, { quoted: m })
            await delay(900)
          } catch { continue }
        }

        await m.react('✔️')
        break
      }

      // ===== أمر ثابت ===== //
      case 'ثابت': {
        const نص = m.quoted?.text || text
        if (!نص) return conn.reply(m.chat, '❌ ارسل نص أو اقتبس رسالة.', m)

        await m.react('🕒')
        const buf = Buffer.from(نص)
        const st = await sticker(buf, false, pack, author)
        await conn.sendMessage(m.chat, { sticker: st }, { quoted: m })
        await m.react('✔️')
        break
      }

      // ===== تعديل ستكر ===== //
      case 'تعديل': {
        if (!m.quoted) return conn.reply(m.chat, '❌ رد على ستكر لتعديله.', m)

        await m.react('🕒')
        const data = await m.quoted.download()
        const [p, a] = text.split('|').map(v => v?.trim())
        const ex = await addExif(data, p || pack, a || author)
        await conn.sendMessage(m.chat, { sticker: ex }, { quoted: m })
        await m.react('✔️')
        break
      }
    }
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, `⚠︎ حدث خطأ:\n${e.message}`, m)
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms))

handler.command = ['ستكري', 'ثابت', 'تعديل']
handler.tags = ['sticker']
handler.help = ['ستكري *بحث*', 'ثابت', 'تعديل']

export default handler