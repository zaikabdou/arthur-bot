import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // 🏦 جلب البيانات من GitHub
    let { data } = await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-hestia.json')

    if (!Array.isArray(data) || data.length === 0)
      return conn.reply(m.chat, '🏦 ⇦ ≺تعذر العثور على صور هـيـسـتـيـا حاليا😔≻', m)

    // ❄️ اختيار صورة عشوائية
    let url = data[Math.floor(Math.random() * data.length)]

    // ❄️ إرسال الصورة مع زر “التالي”
    await conn.sendButton(
      m.chat,
      `🔥 ⇦ ≺هـيـسـتـيـا 🥷≻`,
      author,
      url,
      [
        ['جـيب الـي بعـده يا  𝙰𝚁𝚃𝙷𝚄𝚁 ⚡', `${usedPrefix + command}`]
      ],
      m
    )

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة هـيـسـتـيـا، حاول لاحقًا≻', m)
  }
}

handler.help = ['hestia', 'هيستيا']
handler.tags = ['anime']
handler.command = /^(hestia|هيستيا)$/i

export default handler