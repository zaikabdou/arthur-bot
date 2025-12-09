import FormData from "form-data";
import Jimp from "jimp";

let handler = async (m, { conn, usedPrefix, command, args }) => {
    // خريطة من أوامر عربية إلى أسماء طرق المعالجة في الـ API
    const methodMap = {
        "إزالة_الضباب": "dehaze",
        "إعادة_تلوين": "recolor",
        "تحسين": "enhance",
        "تمويه": "blur",
        "توضيح": "sharpen"
    };

    // قائمة الأوامر الفرعية (تُعرض للمستخدم عند استخدام `تعديل` بدون معامل)
    const subcommands = Object.keys(methodMap);
    const subcommandList = subcommands.map((cmd, index) => `${index + 1}. ${cmd}`).join('\n');
    const promptMessage = `اختر عملية من القائمة التالية:\n${subcommandList}\n\nاستخدم الأمر بالشكل التالي:\n${usedPrefix}تعديل <رقم_العملية>`;

    if (command === "تعديل") {
        if (!args[0]) return m.reply(promptMessage);

        const selectedIndex = parseInt(args[0], 10) - 1;
        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= subcommands.length) {
            return m.reply(`اختيار غير صالح. ${promptMessage}`);
        }

        const selectedArabic = subcommands[selectedIndex];
        const mappedMethod = methodMap[selectedArabic]; // اسم الطريقة الإنجليزية
        // تنفيذ العملية مباشرة بدون استدعاء handler نفسه
        return await processImage(m, conn, mappedMethod, "*｢⚕️┊𝙰𝚁𝚃_𝙱𝙾𝚃┊⚕️｣*");
    } else {
        // لو تم استدعاء أحد الأوامر الفرعية مباشرة مثل "تحسين"
        const mappedMethod = methodMap[command] || command; // إذا كان المستخدم مرّر اسم إنجليزي فاتركه كما هو
        await processImage(m, conn, mappedMethod, "*｢⚕️┊𝙰𝚁𝚃_𝙱𝙾𝚃┊⚕️｣*");
    }
};

handler.help = ["اديت"];
handler.tags = ["أدوات"];
handler.command = ["تعديل", "إزالة_الضباب", "إعادة_تلوين", "تحسين", "تمويه", "توضيح"];
export default handler;

async function processImage(m, conn, method, caption) {
    // تأكيد وجود مكان لتتبع العمليات على هذا الـ method
    conn[method] = conn[method] ? conn[method] : {};
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!mime) throw `أين هي الصورة؟`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `النوع ${mime} غير مدعوم`;

    conn[method][m.sender] = true;

    // رسالة انتظار احتياطية لو ما في متغير wait معرف
    const waitMsg = typeof wait !== "undefined" ? wait : "⌛ جارٍ المعالجة...";
    m.reply(waitMsg);

    let img = await q.download?.();
    let error = false;
    try {
        const This = await processing(img, method);
        await conn.sendFile(m.chat, This, "result.jpg", caption, m);
    } catch (er) {
        console.error(er);
        error = true;
    } finally {
        if (error) m.reply("عملية فشلت :(");
        delete conn[method][m.sender];
    }
}

async function processing(urlPath, method) {
    return new Promise(async (resolve, reject) => {
        let Methods = ["enhance", "recolor", "dehaze", "blur", "sharpen"];
        method = Methods.includes(method) ? method : Methods[0];

        let Form = new FormData();
        // حط القيمة كـ string/number عادي (الخيارات الثالثة ليست ضرورية هنا للقيم البسيطة)
        Form.append("model_version", "1");
        Form.append("image", Buffer.from(urlPath), {
            filename: "enhance_image_body.jpg",
            contentType: "image/jpeg",
        });

        const scheme = "https://inferenceengine.vyro.ai/" + method;

        Form.submit(
            {
                url: scheme,
                host: "inferenceengine.vyro.ai",
                path: "/" + method,
                protocol: "https:",
                headers: {
                    "User-Agent": "okhttp/4.9.3",
                    Connection: "Keep-Alive",
                    "Accept-Encoding": "gzip",
                },
            },
            function (err, res) {
                if (err) return reject(err);
                let data = [];
                res
                    .on("data", function (chunk) {
                        data.push(chunk);
                    })
                    .on("end", () => {
                        resolve(Buffer.concat(data));
                    })
                    .on("error", (e) => {
                        reject(e);
                    });
            }
        );
    });
}