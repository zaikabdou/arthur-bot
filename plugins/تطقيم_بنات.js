import fetch from "node-fetch"

let handler = async (m, { conn }) => {
  try {
    // جلب بيانات JSON عشوائي
    let res = await fetch('https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/lib/miku54.json')
    if (!res.ok) throw new Error('Failed to fetch JSON')
    let data = await res.json()
    if (!Array.isArray(data) || data.length === 0) throw new Error('No data in JSON')

    let cita = data[Math.floor(Math.random() * data.length)]

    // تحميل الصورة الأولى
    let img1_res = await fetch(cita.cowo)
    if (!img1_res.ok) throw new Error('Failed to fetch first image')
    let img1_buf = Buffer.from(await img1_res.arrayBuffer())

    // إرسال الصورة الأولى
    await conn.sendMessage(m.chat, { image: img1_buf, caption: '*قَـلـب  𝙰𝚁𝚃𝙷𝚄𝚁 ❤️💋*' }, { quoted: m })

    // تحميل الصورة الثانية
    let img2_res = await fetch(cita.cewe)
    if (!img2_res.ok) throw new Error('Failed to fetch second image')
    let img2_buf = Buffer.from(await img2_res.arrayBuffer())

    // إرسال الصورة الثانية
    await conn.sendMessage(m.chat, { image: img2_buf, caption: '*حـب  𝙰𝚁𝚃𝙷𝚄𝚁 💋❤️*' }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ حدث خطأ أثناء تحميل الصور، حاول مرة أخرى.')
  }
}

handler.help = ['طقمي', 'تطقيم_بنات']
handler.tags = ['anime']
handler.command = /^(طقمي|تطقيم_بنات|ppcouple|ppcp)$/i
handler.limit = true

export default handler