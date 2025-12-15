import fetch from "node-fetch"
import { db } from '../lib/postgres.js'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {

        // معلومات المستخدم من قاعدة البيانات
        const userResult = await db.query(
            'SELECT sticker_packname, sticker_author FROM usuarios WHERE id = $1',
            [m.sender]
        )
        const user = userResult.rows[0] || {}

        let f = user.sticker_packname || global.info.packname
        let g = (
            user.sticker_packname && user.sticker_author
                ? user.sticker_author
                : (user.sticker_packname && !user.sticker_author
                    ? ''
                    : global.info.author)
        )

        // التحقق من الرابط
        if (!args[0]) throw `⚠️ أدخل رابط حزمة ستكرات تيليجرام\nمثال:\n${usedPrefix + command} https://t.me/addstickers/Porcientoreal`
        if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) throw `⚠️ الرابط غير صالح`

        let packName = args[0].replace("https://t.me/addstickers/", "")

        // جلب بيانات الحزمة
        let gas = await fetch(
            `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`,
            { method: "GET", headers: { "User-Agent": "GoogleBot" } }
        )

        if (!gas.ok) throw `⚠️ فشل الوصول إلى خادم تيليجرام.`

        let json = await gas.json()

        m.reply(`✔️ *عدد الستكرات:* ${json.result.stickers.length}\n⏱️ *المدة التقريبية:* ${json.result.stickers.length * 1.5} ثانية`)

        // إرسال الستكرات واحدًا تلو الآخر
        for (let i = 0; i < json.result.stickers.length; i++) {

            let fileId = json.result.stickers[i].thumb.file_id
            let gasIn = await fetch(
                `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`
            )
            let jisin = await gasIn.json()

            // إنشاء الستكر
            let stiker = await sticker(
                false,
                `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${jisin.result.file_path}`,
                f,
                g
            )

            // إرسال الستكر للمستخدم مع بيانات الحقوق
            await conn.sendFile(
                m.chat,
                stiker,
                'sticker.webp',
                '',
                m,
                true,
                {
                    contextInfo: {
                        forwardingScore: 200,
                        isForwarded: false,
                        externalAdReply: {
                            showAdAttribution: false,
                            title: global.info.wm,
                            body: `حزمة ستكرات`,
                            mediaType: 2,
                            sourceUrl: global.info.nna,
                            thumbnail: await conn.profilePictureUrl(m.sender, 'image').catch(_ => null)
                        }
                    }
                },
                { quoted: m }
            )

            await delay(3000)
        }

    } catch (e) {
        console.error(e)
        throw `⚠️ حدث خطأ أثناء جلب الستكرات.\nتحقق من الرابط أو حاول لاحقاً.`
    }
}

handler.help = ['تيلي *<url>*']
handler.tags = ['sticker', 'downloader']
handler.command = /^(تيلي)$/i
handler.limit = 1
handler.register = true

export default handler

const delay = t => new Promise(res => setTimeout(res, t))