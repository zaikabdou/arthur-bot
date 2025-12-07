import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_util' // child_process أحدث
import { promisify } from 'util'
const execAsync = promisify(exec)

import { sticker } from '../lib/sticker.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false
    let userId = m.sender
    let pack = global.db.data.users[userId] || {}
    let author = pack.text2 || global.packsticker2 || '✦ ʙʏ ᴀʙᴅᴏᴜ'
    let packname = pack.text1 || global.packsticker || '✨ ᴀʙᴅᴏᴜ ʙᴏᴛ'

    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        let txt = args.join(' ')

        await m.react('🕓')

        // 1️⃣ حالة إرسال رابط مباشر
        if (args[0] && isUrl(args[0])) {
            let url = args[0]
            let marca = txt.includes('|') || txt.includes('•') 
                ? txt.split(/[\u2022|]/).map(t => t.trim()) 
                : [packname, author]

            stiker = await sticker(false, url, marca[0] || packname, marca[1] || author)
        }
        // 2️⃣ حالة إرسال ميديا (صورة/فيديو/GIF/ستيكر)
        else if (/image|video|webp/.test(mime)) {
            let media = await q.download()
            let isVideo = mime.includes('video')
            let isGif = mime.includes('gif') || (q.msg || q).seconds

            // فيديو أطول من 15 ثانية → يتم قصه تلقائيًا
            if (isVideo && (q.msg || q).seconds > 15) {
                await conn.reply(m.chat, '✂️ الفيديو أطول من 15 ثانية، سيتم قصه تلقائيًا إلى أول 15 ثانية...', m)
            }

            let marca = txt && (txt.includes('|') || txt.includes('•'))
                ? txt.split(/[\u2022|]/).map(t => t.trim())
                : [packname, author]

            // إذا كان ستيكر قديم → نحوله لـ WebP نظيف أولاً
            if (mime === 'image/webp') {
                let img = await webp2png(media)
                media = Buffer.from(await (await global.fetch(img)).arrayBuffer())
            }

            // تحويل مباشر باستخدام المكتبة (تدعم GIF وفيديو < 15 ثانية)
            if ((!isVideo && !isGif) || (q.msg || q).seconds <= 15) {
                stiker = await sticker(media, false, marca[0], marca[1])
            } else {
                // فيديو/GIF طويل → نستخدم ffmpeg للمعالجة المتقدمة
                let inputPath = path.join(tmpdir(), `input_\( {Date.now()}. \){isVideo ? 'mp4' : 'gif'}`)
                let outputPath = path.join(tmpdir(), `stiker_${Date.now()}.webp`)

                fs.writeFileSync(inputPath, media)

                await execAsync(`
                    ffmpeg -y -i "${inputPath}"
                    -t 15
                    -vf "scale='min(512,iw)':'min(512,ih)':force_original_aspect_ratio=decrease,
                         pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000,
                         fps=15"
                    -c:v libwebp -loop 0 -preset default -an -vsync 0
                    "${outputPath}"
                `.replace(/\s+/g, ' '))

                let webpBuffer = fs.readFileSync(outputPath)
                stiker = await sticker(webpBuffer, true, marca[0], marca[1])

                // تنظيف الملفات المؤقتة
                fs.unlinkSync(inputPath)
                fs.unlinkSync(outputPath)
            }
        }
        else {
            return conn.reply(m.chat, `
❀ *كيف تستخدم الأمر؟*

• ارسل صورة أو فيديو أو GIF مع الأمر
• أو ارسل رابط مباشر لصورة/فيديو
• يمكنك كتابة اسم + مؤلف مفصولين بـ | أو •

مثال:
${usedPrefix + command} عبدالرحمن • بوت الزعيم
            `.trim(), m)
        }

    } catch (e) {
        console.error('خطأ في أمر الستيكر:', e)
        await conn.reply(m.chat, `⚠️ حدث خطأ أثناء إنشاء الملصق:\n\`\`\`${e.message || e}\`\`\``, m)
        await m.react('✖️')
        return
    } finally {
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
            await m.react('✅')
            // تنظيف الذاكرة
            stiker = null
        }
    }
}

handler.help = ['ملصق', 'ستيكر', 's']
handler.tags = ['sticker']
handler.command = /^(ملصق|ستيكر|ستكر|حول|تحويل|sticker|s)$/i

export default handler

// دالة فحص الرابط (يدعم jpg, jpeg, png, gif, mp4, webm)
const isUrl = (text) => {
    return /^https?:\/\/.+\.(jpe?g|png|gif|mp4|webm|webp)(\?.*)?$/i.test(text)
}