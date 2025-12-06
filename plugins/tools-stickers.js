import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'

let handler = async (m, { conn, args }) => {
    let stiker = false
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker
    let texto2 = packstickers.text2 || global.packsticker2

    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        let txt = args.join(' ')

        if (!/webp|image|video|gif/g.test(mime) || !q.download)
            return conn.reply(m.chat, '❀ أرسل صورة، فيديو قصير أو GIF لتحويله إلى ستكر.', m)

        let buffer = await q.download()
        await m.react('🕓')
        let marca = txt ? txt.split(/[\u2022|]/).map(p => p.trim()) : [texto1, texto2]

        let ext = mime.includes('video') || mime.includes('gif') ? 'mp4' : 'png'
        let tmpFile = path.join(tmpdir(), `input.${ext}`)
        fs.writeFileSync(tmpFile, buffer)

        let tmpWebp = path.join(tmpdir(), `output.webp`)

        // ffmpeg لضبط الأبعاد 512x512 وقص الأطراف الزائدة
        await new Promise((resolve, reject) => {
            exec(
                `ffmpeg -y -i "${tmpFile}" -t 15 -vf "scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000" -loop 0 -preset default -an -vsync 0 "${tmpWebp}"`,
                (err) => err ? reject(err) : resolve()
            )
        })

        let webpBuffer = fs.readFileSync(tmpWebp)
        stiker = await sticker(webpBuffer, mime.includes('webp'), marca[0], marca[1])

    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, '⚠︎ حدث خطأ أثناء تحويل الملف: ' + e.message, m)
        await m.react('✖️')
    } finally {
        if (stiker) {
            conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            await m.react('✅')
        }
    }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['حول', 'استيك']

export default handler

// دالة للتأكد إذا النص رابط مباشر
const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(jpe?g|gif|png)/, 'gi'))
}