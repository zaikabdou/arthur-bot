import { canLevelUp, xpRange } from '../lib/levelling.js'

const handler = async (m, { conn, usedPrefix }) => {
  let { exp, level, role, money } = global.db.data.users[m.sender]
  let { xp, max } = xpRange(level, global.multiplier)
  let name = conn.getName(m.sender)
  let user = global.db.data.users[m.sender]
  let before = user.level

  if (!canLevelUp(user.level, user.exp, global.multiplier)) {
    let text = [
      "🦋⃟ᴠͥɪͣᴘͫ•𝆺𝅥𓍯𓂃꒷꒦꒷꒦꒷⚝𓇼 ⋆.˚ 𓆉 𓆝 ⋆.˚ 𓇼꒷꒦︶꒷꒦︶",
      "╮⊰✫⊱─⊰✫⊱─⊰✫⊱╭",
      `✨ 𓆩 مـلـفـك الـشـخـصـي 𓆪 ✨`,
      "╰⊰✫⊱─⊰✫⊱─⊰✫⊱╯",
      `🌷 الاسم: ${name}`,
      `💖 المستوى الحالي: ${user.level}`,
      `👑 الرتبة: ${role}`,
      `💎 الرصيد: ${money || 0}`,
      `🎯 الخبرة: ${user.exp}/${xp}`,
      `🍀 النقاط المتبقية: ${max - user.exp}`,
      "🌟 واصل الإبداع، نحن فخورون بك!",
      "⋆｡˚✧˚ ༘ ⋆｡˚✧˚ ⋆｡˚✧˚ ⋆｡˚✧˚",
      "ᡣ𐭩 ၄၃⚝"
    ].join('\n')

    return m.reply(text)
  }

  while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
  if (before !== user.level) {
    let nextLevelExp = xpRange(user.level + 1, global.multiplier).max
    let remainingPoints = nextLevelExp - user.exp

    let str = [
      "🦋⃟ᴠͥɪͣᴘͫ•𝆺𝅥𓍯꒷꒦꒷꒦꒷⚝𓇼 ⋆.˚ 𓆉 ⋆.˚ 𓇼꒷꒦︶꒷꒦︶",
      "╮⊰✫⊱─⊰✫⊱─⊰✫⊱╭",
      "🌸 𓆩 مـبـروك الـارتـقـاء 𓆪 🌸",
      "╰⊰✫⊱─⊰✫⊱─⊰✫⊱╯",
      `💖 الاسم: ${name}`,
      `🎉 المستوى السابق: ${before}`,
      `🌟 المستوى الحالي: ${user.level}`,
      `🍄 المستوى القادم: ${user.level + 1}`,
      `🎯 النقاط المتبقية: ${remainingPoints}`,
      `👑 الرتبة الحالية: ${role}`,
      `💎 رصيدك: ${money || 0}`,
      `🎀 الخبرة: ${user.exp}`,
      "🌷 استمر في التألق يا نجم 🌟",
      "⋆｡˚✧˚ ༘ ⋆｡˚✧˚ ⋆｡˚✧˚ ⋆｡˚✧˚",
      "ᡣ𐭩 ၄၃⚝",
      "",
      `💌 هل تعلم؟ استخدم ${usedPrefix}shop 🛍️ لتسوق أشياء فخمة 💎`
    ].join('\n')

    try {
      const img = "https://qu.ax/EkkRk.jpg"
      await conn.sendMessage(
        m.chat,
        { image: { url: img }, caption: str, mentions: conn.parseMention(str) },
        { quoted: m }
      )
    } catch {
      m.reply(str)
    }
  }
}

handler.help = ['levelup']
handler.tags = ['xp']
handler.command = ['رانك', 'lvl', 'لفل', 'level']
handler.owner = false

export default handler