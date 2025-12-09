import FormData from "form-data"
import Jimp from "jimp"

const methodMap = {
    "إزالة_الضباب": "dehaze",
    "إعادة_تلوين": "recolor",
    "تحسين": "enhance",
    "تمويه": "blur",
    "توضيح": "sharpen"
}

const subcommands = Object.keys(methodMap)

let handler = async (m, { conn, usedPrefix, command, args }) => {

    // لو المستخدم استدعى الأمر الرئيسي فقط
    if (command === "تعديل") {
        if (!args[0]) {
            let text = "اختر عملية:\n\n"
            subcommands.forEach((cmd, i) => {
                text += `${i + 1}. ${cmd}\n`
            })
            text += `\nاستخدم:\n${usedPrefix}تعديل <رقم>`
            return m.reply(text)
        }

        // تحويل الرقم إلى أمر
        const index = parseInt(args[0]) - 1
        if (isNaN(index) || index < 0 || index >= subcommands.length) {
            return m.reply("❌ رقم غير صالح.")
        }

        const selectedArabic = subcommands[index]
        const method = methodMap[selectedArabic]

        return await processImage(m, conn, method, "✓ تمت المعالجة")
    }

    // لو المستخدم كتب أمر عربي مثل: تحسين – تمويه – توضيح ...
    const mappedMethod = methodMap[command]
    if (mappedMethod) {
        return await processImage(m, conn, mappedMethod, "✓ تمت المعالجة")
    }
}

handler.command = ["تعديل", "إزالة_الضباب", "إعادة_تلوين", "تحسين", "تمويه", "توضيح"]
export default handler


//––––––––––––––––––––––––––––––––––
// دالة المعالجة الأصلية
//––––––––––––––––––––––––––––––––––

async function processImage(m, conn, method, caption) {
    let q = m.quoted || m
    let mime = q.mimetype || q.mediaType || ""

    if (!mime) throw "أرسل صورة"
    if (!/image\/(png|jpe?g)/.test(mime)) throw "النوع غير مدعوم"

    m.reply("⌛ جارٍ المعالجة...")

    let img = await q.download()

    try {
        const result = await processing(img, method)
        await conn.sendFile(m.chat, result, "result.jpg", caption, m)
    } catch (e) {
        console.log(e)
        return m.reply("⚠︎ خطأ أثناء المعالجة")
    }
}

async function processing(buffer, method) {
    return new Promise((resolve, reject) => {
        const valid = ["enhance", "recolor", "dehaze", "blur", "sharpen"]
        if (!valid.includes(method)) method = "enhance"

        const form = new FormData()
        form.append("model_version", "1")
        form.append("image", buffer, { filename: "img.jpg", contentType: "image/jpeg" })

        form.submit({
            url: `https://inferenceengine.vyro.ai/${method}`,
            host: "inferenceengine.vyro.ai",
            path: "/" + method,
            protocol: "https:",
            headers: { "User-Agent": "okhttp/4.9.3" }
        }, (err, res) => {
            if (err) return reject(err)
            let data = []
            res.on("data", c => data.push(c))
            res.on("end", () => resolve(Buffer.concat(data)))
            res.on("error", reject)
        })
    })
}