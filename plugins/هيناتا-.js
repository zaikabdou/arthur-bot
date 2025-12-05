import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // جلب قائمة الصور من GitHub
    let res = await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-hinata.json')
    let list = res.data
    if (!Array.isArray(list) || list.length === 0) throw '❌ ⇦ ≺لا توجد صور متاحة حاليًا≻'

    // اختيار صورة عشوائية
    let url = list[Math.floor(Math.random() * list.length)]

    // إرسال الصورة + زر التالي
    await conn.sendButton(
      m.chat,
      `🔥 ⇦ ≺هـيـنـاتـا 😽≻`,
      '',
      url,
      [['هـات المزه يا 𝙰𝚁𝚃𝙷𝚄𝚁🔥', `${usedPrefix + command}`]],
      m
    )

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ ⇦ ≺حدث خطأ أثناء تحميل الصورة، حاول لاحقًا≻', m)
  }
}

handler.help = ['hinata']
handler.tags = ['anime']
handler.command = /^(hinata|هيناتا)$/i

export default handler