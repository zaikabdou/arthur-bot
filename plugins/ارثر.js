import fetch from 'node-fetch'
import axios from 'axios'
import cheerio from 'cheerio'
import Jimp from 'jimp'
import { sticker } from '../lib/sticker.js'
import { googleImage } from '@bochilteam/scraper'
// ملاحظة: أزلت استيرادات من baileys لأنك لم تستخدمها في الكود الأصلي.
// إذا لازمتها لاحقًا أعد استيرادها.

const delay = ms => new Promise(res => setTimeout(res, ms))

const base = "https://www.pinterest.com"
const search = "/resource/BaseSearchResource/get/"

const headers = {
  'accept': 'application/json, text/javascript, */*, q=0.01',
  'referer': 'https://www.pinterest.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'x-app-version': 'a9522f',
  'x-pinterest-appstate': 'active',
  'x-pinterest-pws-handler': 'www/[username]/[slug].js',
  'x-requested-with': 'XMLHttpRequest'
}

const NSFW_FILTER = ['caca', 'سكس', "اباحي", "مايا خليفه", "نيك", "شاذ", "شذوذ", "polla", 'porno', "porn", 'gore', 'cum', "semen", "puta", "puto", 'culo', "putita", "putito", "pussy", 'hentai', "pene", "coño", "asesinato", 'zoofilia', "mia khalifa", "desnudo", "desnuda", 'cuca', 'chocha', "muertos", "pornhub", "xnxx", "xvideos", "teta", "vagina", "marsha may", "misha cross", "sexmex", 'furry', "furro", "furra", 'xxx', "rule34", "panocha", "pedofilia", "necrofilia", 'pinga', "horny", "ass", "nude", 'popo', "nsfw", "femdom", "futanari", "erofeet", "sexo", "sex", "yuri", "ero", "ecchi", 'blowjob', "anal", "ahegao", "pija", "verga", "trasero", "violation", "violacion", "bdsm", 'cachonda', "+18", 'cp', "mia marin", "lana rhoades", "cepesito", 'hot', "buceta", 'xxx']

async function getCookies() {
  try {
    const response = await axios.get(base)
    const setHeaders = response.headers['set-cookie']
    if (setHeaders) {
      const cookies = setHeaders.map(cookieString => cookieString.split(';')[0].trim()).join('; ')
      return cookies
    }
    return null
  } catch (error) {
    console.error("خطأ أثناء جلب الكوكيز:", error)
    return null
  }
}

async function searchPinterest(query) {
  if (!query) {
    return { status: false, message: "يرجى إدخال كلمة بحث صحيحة!" }
  }

  try {
    const cookies = await getCookies()
    if (!cookies) {
      return { status: false, message: "فشل في استرجاع الكوكيز، حاول مرة أخرى لاحقًا." }
    }

    const params = {
      source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
      data: JSON.stringify({
        options: { isPrefetch: false, query, scope: "pins", bookmarks: [""], page_size: 20 },
        context: {}
      }),
      _: Date.now()
    }

    // بناء الرابط بشكل صحيح
    const { data } = await axios.get(`${base}${search}`, {
      headers: { ...headers, 'cookie': cookies },
      params
    })

    let results = data?.resource_response?.data?.results || []
    // فلترة نتائج تحتوي على صورة أصلية
    results = results.filter(v => v?.images?.orig && v.images.orig.url)
    if (results.length === 0) {
      return { status: false, message: `لم يتم العثور على نتائج لكلمة البحث: ${query}` }
    }

    // فلترة لاختيار "صور جيدة": تجاهل الصغيرة أو بدون title/desc، وأخذ أعلى جودة
    results = results.filter(pin =>
      pin.images.orig.width > 500 &&
      pin.images.orig.height > 500 &&
      (pin.title || pin.description)
    ).slice(0, 15)

    return {
      status: true,
      pins: results.map(result => ({
        id: result.id,
        title: result.title || "بدون عنوان",
        description: result.description || "بدون وصف",
        pin_url: `https://pinterest.com/pin/${result.id}`,
        image: result.images.orig.url,
        uploader: {
          username: result.pinner?.username || '',
          full_name: result.pinner?.full_name || '',
          profile_url: (result.pinner?.username) ? `https://pinterest.com/${result.pinner.username}` : ''
        }
      }))
    }

  } catch (error) {
    console.error('searchPinterest error:', error?.message || error)
    return { status: false, message: "حدث خطأ أثناء البحث في Pinterest، حاول مرة أخرى لاحقًا." }
  }
}

async function getGoogleImages(query) {
  try {
    const images = await googleImage(query + ' high quality')
    return images.slice(0, 10).filter(img => img && typeof img === 'string' && img.startsWith('http') && !img.includes('data:'))
  } catch (error) {
    console.error('Google Image error:', error)
    return []
  }
}

/**
 * أمر: .ارثر <اسم الشخصية> [عدد]
 */
let handler = async (m, { conn, args, usedPrefix, text }) => {
  try {
    // فلتر NSFW
    const rawQuery = (args || []).join(' ').trim()
    const queryLower = rawQuery.toLowerCase()

    if (NSFW_FILTER.some(bad => queryLower.includes(bad))) {
      return conn.reply(m.chat, " *استغفر ربك احسن* 😒", m)
    }
    if (!rawQuery) {
      return conn.reply(m.chat, `✳️ استخدم: ${usedPrefix}ارثر <اسم الشخصية> [عدد]\nمثال: ${usedPrefix}ارثر اكازا 5`, m)
    }

    // تحليل العدد إن كان في آخر النص
    const parts = rawQuery.split(/\s+/).filter(Boolean)
    let count = 4
    let searchQuery = rawQuery

    const lastPart = parts[parts.length - 1]
    const parsed = parseInt(lastPart)
    if (!Number.isNaN(parsed)) {
      count = Math.max(1, Math.min(parsed, 15)) // قيد بين 1 و 15
      parts.pop()
      searchQuery = parts.join(' ')
    }

    searchQuery = searchQuery.trim()
    if (!searchQuery) searchQuery = lastPart // fallback إن كان المستخدم كتب كلمة واحدة مع رقم خاطئ

    const maxStickers = Math.min(count, 15)

    await m.react('🕒')
    conn.reply(m.chat, `⌛ جارٍ البحث عن صور "${searchQuery}" (${maxStickers} ستيكر)...`, m)

    // بحث Pinterest أولاً
    let result = await searchPinterest(searchQuery)
    let images = result.status ? result.pins.map(p => p.image) : []

    // لو فشل Pinterest أو حصلنا على صور قليلة -> جيب من Google كـ fallback
    if (images.length < Math.min(3, maxStickers)) {
      const googleImgs = await getGoogleImages(searchQuery)
      images = [...images, ...googleImgs]
    }

    // فلترة إضافية: شيل أي URL مريب، وإخراج عدد مناسب
    images = images.filter(img =>
      img &&
      !img.toLowerCase().includes('data:image') &&
      typeof img === 'string' &&
      img.length > 50
    ).slice(0, maxStickers)

    if (!images.length) {
      await m.react('✖️')
      return conn.reply(m.chat, '⚠︎ لم أعثر على صور مناسبة.', m)
    }

    // بيانات الحقوق من المستخدم أو افتراضي
    const user = m.sender
    const uData = global.db?.data?.users?.[user] || {}
    const packname = uData.text1 || global.packsticker || 'ستكر'
    const author = uData.text2 || global.packsticker2 || 'بوت'

    // إرسال ستيكرز
    let sentCount = 0
    for (let i = 0; i < images.length; i++) {
      const src = images[i]
      try {
        const res = await fetch(src)
        if (!res.ok) continue
        const buf = await res.buffer()

        // تحضير: قص مربع + resize 512x512
        const image = await Jimp.read(buf)
        const w = image.getWidth()
        const h = image.getHeight()
        const size = Math.min(w, h)
        const x = Math.floor((w - size) / 2)
        const y = Math.floor((h - size) / 2)
        image.crop(x, y, size, size)
        image.cover(512, 512) // يغطي 512x512 مع الاحتفاظ بالمحتوى
        const outBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)

        // تحويل لستكر (دالة sticker يجب أن تُعيد Buffer أو ميديا جاهزة للـ sendMessage)
        const st = await sticker(outBuffer, false, packname, author)

        await conn.sendMessage(m.chat, { sticker: st }, { quoted: m })
        sentCount++
        await delay(800)
      } catch (e) {
        console.error('ارثر error:', e?.message || e)
        continue
      }
    }

    if (sentCount === 0) {
      await m.react('✖️')
      return conn.reply(m.chat, '⚠︎ لم يتم إرسال أي ستيكر.', m)
    }

    await m.react('✔️')
    conn.reply(m.chat, `✅ تم إرسال ${sentCount} ستيكر!`, m)
  } catch (err) {
    console.error(err)
    await m.react('✖️')
    conn.reply(m.chat, `⚠︎ خطأ: ${err.message || err}`, m)
  }
}

handler.help = ['ارثر <اسم> [عدد]']
handler.tags = ['downloader', 'sticker']
handler.command = ['ارثر']

export default handler