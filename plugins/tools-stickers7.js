let handler = async (m, { conn }) => {
  try {
    // لازم يكون فيه اقتباس (ريبلاي) على الـ GIF
    if (!m.quoted) return conn.reply(m.chat, '✦ ارد على الـ GIF بالأمر عشان أحوله لستيكر متحرك ♡', m)

    let mime = m.quoted.mimetype || ''
    if (!/gif/.test(mime)) return conn.reply(m.chat, '✦ هذا مو GIF يا حلو، ارسل GIF صحيح ✗', m)

    await m.react('🕒')

    // نجيب الـ GIF ونحوله لستيكر باستخدام وظيفة Baileys المدمجة
    let media = await m.quoted.download()

    await conn.sendMessage(m.chat, {
      sticker: media,
      // هذي الخاصية تخلي أي GIF يتحول تلقائيًا لستيكر متحرك بدون أي شيء إضافي
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('✖️')
    await conn.reply(m.chat, '✦ صار خطأ غريب، جرب ارسل الـ GIF مرة ثانية...', m)
  }
}

handler.help = ['غراي', 'الصق']
handler.tags = ['sticker']
handler.command = ['غراي', 'الصق', 'جراف', 'gifs']

export default handler