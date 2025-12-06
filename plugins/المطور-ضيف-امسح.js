// تـم الـتـطـويـر بـواسـطـه مـونتـي 💚

import fs from 'fs'

// 🌿 أرقام الأونر
const allowedNumbers = [
  '213551217759@s.whatsapp.net',
  '213773231685@s.whatsapp.net'
]

const handler = async (m, { conn, text, command }) => {
  // تحقق من الصلاحية
  if (!allowedNumbers.includes(m.sender)) {
    await conn.reply(m.chat, '❄️ ⇦ ≺غـيـر مـسـمـوح لـك يـا عبـد 😂🌿≺', m)
    return
  }

  if (!text) {
    await conn.reply(m.chat, '❄️ ⇦ ≺اكـتـب اسـم الـمـلـف يـا بـابـا✍️🌸≺', m)
    return
  }

  const path = `plugins/${text}.js`

  // 📩 أمر الإضافة
  if (command === 'ضيف') {
    if (!m.quoted || !m.quoted.text) {
      await conn.reply(m.chat, '❄️ ⇦ ≺رد عـلـى الـكـود لـي أحـفـظـه يـا بـابـا💾🌿≺', m)
      return
    }

    fs.writeFileSync(path, m.quoted.text)
    await conn.reply(m.chat, `❄️ ⇦ ≺تـم حـفـظ الـمـلـف ${path} بـنـجـاح🌸💾≺`, m)
  }

  // 🗑️ أمر الحذف
  else if (command === 'امسح') {
    if (!fs.existsSync(path)) {
      await conn.reply(m.chat, `❄️ ⇦ ≺الـمـلـف ${path} مـش مـوجـود😢≺`, m)
      return
    }

    fs.unlinkSync(path)
    await conn.reply(m.chat, `❄️ ⇦ ≺تـم حـذف الـمـلـف ${path} بـنـجـاح🌿🗑️≺`, m)
  }
}

// ✅ هذا الشكل المطلوب ليشتغل في نظامك
handler.help = ['ضيف', 'امسح']
handler.tags = ['owner']
handler.command = /^(ضيف|امسح)$/i

export default handler