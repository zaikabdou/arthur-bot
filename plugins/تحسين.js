import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  // التأكد من وجود صورة مرفقة أو صورة في الرد
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!/image/.test(mime)) return m.reply('📷 ارسل صورة أو رد على صورة بكتابة .تحسين')

  await m.react('🕐')
  await m.reply('جًـاري الـتـحـسيـن 🌋....')

  try {
    // تحميل الصورة
    let img = await q.download?.()
    if (!img) throw 'فشل تحميل الصورة 😢'

    // إرسال الصورة إلى نموذج تحسين الجودة من Hugging Face
    let apiUrl = 'https://api-inference.huggingface.co/models/caidas/swin2sr-classical-sr-x4-64'
    let res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: img
    })

    if (!res.ok) throw 'الخادم رفض الطلب ⚠️'
    let buff = Buffer.from(await res.arrayBuffer())

    await conn.sendFile(m.chat, buff, 'hd.jpg', '✅ تم تحسين الصورة بنجاح', m)
    await m.react('✅')
  } catch (err) {
    console.log(err)
    await m.reply('❌ فشل تحسين الصورة، حاول مرة أخرى لاحقاً.')
    await m.react('❌')
  }
}

handler.command = /^تحسين$/i
export default handler