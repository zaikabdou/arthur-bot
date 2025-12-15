import fetch from 'node-fetch'
import cheerio from 'cheerio'
import Jimp from 'jimp'
import { sticker } from '../lib/sticker.js'

const delay = ms => new Promise(res => setTimeout(res, ms))

/**
 * أمر: .ارثر <اسم الشخصية>
 * - يجلب صور من Pinterest
 * - يقص كل صورة إلى 1:1 (مربّع) ويعدّل الحجم إلى 512x512
 * - يحول كل صورة لستكر ويرسلهم واحد ورا بعض بفاصل 1100ms
 */

let handler = async (m, { conn, args, usedPrefix }) => {
  try {
    const query = (args || []).join(' ').trim()
    if (!query) return conn.reply(m.chat, `✳️ استخدم: ${usedPrefix}ارثر <اسم الشخصية>\nمثال: ${usedPrefix}ارثر اكازا`, m)

    await m.react('🕒')
    conn.reply(m.chat, `⌛ جارٍ البحث عن صور "${query}"...`, m)

    // جلب روابط الصور (ترجع array من روابط)
    const images = await pinterest(query)
    if (!images || !images.length) {
      await m.react('✖️')
      return conn.reply(m.chat, '⚠︎ لم أعثر على صور مناسبة.', m)
    }

    // خذ أول 4 صور (أو أقل لو ما كانت متاحة)
    const maxStickers = 15
    const selected = images.slice(0, maxStickers)

    // بيانات الحقوق من قاعدة البيانات أو global
    const user = m.sender
    const uData = global.db?.data?.users?.[user] || {}
    const packname = uData.text1 || global.packsticker || 'ستكر'
    const author = uData.text2 || global.packsticker2 || 'بوت'

    // أرسل كل صورة كستيكَر بعد تحويلها لمربع ثم webp
    let sentAny = false
    for (const src of selected) {
      try {
        // جلب الصورة كـ buffer
        const res = await fetch(src)
        if (!res.ok) continue
        const buf = await res.buffer()

        // تحضير الصورة: crop center square و resize 512x512
        const image = await Jimp.read(buf)
        const w = image.getWidth()
        const h = image.getHeight()
        const size = Math.min(w, h)
        const x = Math.floor((w - size) / 2)
        const y = Math.floor((h - size) / 2)
        image.crop(x, y, size, size)
        image.cover(512, 512) // يحفظ النسبة 1:1 ويملأ
        const outBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)

        // حول للبوت إلى ستيكر (sticker.js يدعم Buffer كأول براميتر)
        const st = await sticker(outBuffer, false, packname, author)

        // إرسال الستيكر
        await conn.sendMessage(m.chat, { sticker: st }, { quoted: m })
        sentAny = true

        // فاصل 1.1 ثانية
        await delay(1100)
      } catch (e) {
        console.error('ارثر send error:', e)
        continue
      }
    }

    if (!sentAny) {
      await m.react('✖️')
      return conn.reply(m.chat, '⚠︎ لم يتم إرسال أي ستيكر — حاول مرة أخرى أو جرب كلمة بحث مختلفة.', m)
    }

    await m.react('✔️')
  } catch (err) {
    console.error(err)
    await m.react('✖️')
    conn.reply(m.chat, `⚠︎ حدث خطأ: ${err.message || err}`, m)
  }
}

handler.help = ['ارثر <اسم>']
handler.tags = ['downloader','sticker']
handler.command = ['ارثر']

export default handler

// --------- دالة جلب صور من Pinterest (نسخة مبسطة ومعتمدة على صفحة البحث) ----------
async function pinterest(text) {
  try {
    const response = await fetch(`https://id.pinterest.com/search/pins/?autologin=true&q=${encodeURIComponent(text)}`, {
      headers: {
        // الهيدر هذا يساعد بالحصول على الصور من صفحة البحث
        "cookie": "_auth=1; _b=\"AXOtdcLOEbxD+qMFO7SaKFUCRcmtAznLCZY9V3z9tcTqWH7bPo637K4f9xlJCfn3rl4=\"; _pinterest_sess=TWc9PSZWcnpkblM5U1pkNkZ0dzZ6NUc5WDZqZEpGd2pVY3A0Y2VJOGg0a0J0c2JFWVpQalhWeG5iTTRJTmI5R08zZVNhRUZ4SmsvMG1CbjBWUWpLWVFDcWNnNUhYL3NHT1EvN3RBMkFYVUU0T0dIRldqVVBrenVpbGo5Q1lONHRlMzBxQTBjRGFSZnFBcTdDQVgrWVJwM0JtN3VRNEQyeUpsdDYreXpYTktRVjlxb0xNanBodUR1VFN4c2JUek1DajJXbTVuLzNCUDVwMmRlZW5VZVpBeFQ5ZC9oc2RnTGpEMmg4M0Y2N2RJeVo2aGNBYllUYjRnM05VeERzZXVRUVVYNnNyMGpBNUdmQ1dmM2s2M0txUHRuZTBHVFJEMEE1SnIyY2FTTm9DUEVTeWxKb3V0SW13bkV3TldyOUdrdUZaWGpzWmdaT0JlVnhWb29xWTZOTnNVM1NQSzViMkFUTjBpRitRRVMxaUFxMEJqell1bVduTDJid2l3a012RUgxQWhZT1M3STViSVkxV0dSb1p0NTBYcXlqRU5nPT0ma25kRitQYjZJNTVPb2tyVnVxSWlleEdTTkFRPQ==; _ir=0"
      }
    })
    const data = await response.text()
    const $ = cheerio.load(data)
    const result = []
    $('div > a').get().map(b => {
      const link = $(b).find('img').attr('src')
      if (link) result.push(link)
    })
    const hasil = []
    result.forEach(v => {
      if (v && v.includes('236')) {
        hasil.push(v.replace(/236/g, '736'))
      } else if (v) {
        hasil.push(v)
      }
    })
    // إزالة أول نتيجة إن كانت غير صالحة
    if (hasil.length && hasil[0].includes('data:image')) hasil.shift()
    // إرجاع رباعية أو أكثر
    return hasil.filter(Boolean)
  } catch (error) {
    throw error
  }
}