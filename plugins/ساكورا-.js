import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // جلب صور ساكورا من الريبو
    let res = await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-sakura.json')
    let list = res.data
    if (!Array.isArray(list) || list.length === 0) throw '❌ لا توجد صور متاحة حاليًا.'

    // اختيار صورة عشوائية
    let url = list[Math.floor(Math.random() * list.length)]

    // إرسال الصورة مع الزر
    await conn.sendButton(
      m.chat,
      `🌹 ⇦ ≺ســاكــورا 🌸≻`,
      author || '',
      url,
      [['الـجـايه يـا ايَـتـاتـَشْـٌي 🔥', `${usedPrefix + command}`]],
      m
    )

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ ⇦ ≺حدث خطأ أثناء جلب الصورة، حاول لاحقًا≻', m)
  }
}

handler.help = ['sakura']
handler.tags = ['anime']
handler.command = /^(sakura|ساكورا)$/i

export default handler