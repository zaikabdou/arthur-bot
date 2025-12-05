import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // 🏦 ⇦ جلب بيانات صور ميكاسا من GitHub
    let { data } = await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-mikasa.json')

    if (!Array.isArray(data) || data.length === 0)
      return conn.reply(m.chat, '🏦 ⇦ ≺لم يتم العثور على صور ميكاسا حاليا 😔≻', m)

    // ❄️ ⇦ اختيار صورة عشوائية
    let url = data[Math.floor(Math.random() * data.length)]

    // ❄️ ⇦ إرسال الصورة مع زر “التالي”
    await conn.sendButton(
      m.chat,
      `🐥 ⇦ ≺مـيـكـاسـا 🤗≻`,
      author,
      url,
      [
        ['عـرض الـمـزيـد 🔥🐉', `${usedPrefix + command}`]
      ],
      m
    )

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '🏦 ⇦ ≺حدث خطأ أثناء تحميل صورة ميكاسا، حاول لاحقًا≻', m)
  }
}

handler.help = ['mikasa', 'ميكاسا']
handler.tags = ['anime']
handler.command = /^(mikasa|ميكاسا)$/i

export default handler