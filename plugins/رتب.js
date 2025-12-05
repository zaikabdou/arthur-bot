import { areJidsSameUser } from '@whiskeysockets/baileys'
import { createHash } from 'crypto'
import { canLevelUp, xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, args, participants }) => {
  let users = Object.entries(global.db.data.users).map(([key, value]) => {
    return { ...value, jid: key }
  })

  let who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
    ? conn.user.jid
    : m.sender

  let user = global.db.data.users[who]
  if (!user) throw '⚠️ المستخدم غير موجود في قاعدة البيانات!'

  // فرز المستخدمين
  let sortedExp = users.map(toNumber('exp')).sort(sort('exp', false))
  let sortedLevel = users.map(toNumber('level')).sort(sort('level', false))
  let sortedCredit = users.map(toNumber('credit')).sort(sort('credit', false))
  let sortedBank = users.map(toNumber('bank')).sort(sort('bank', false))

  let usersExp = sortedExp.map(enumGetKey)
  let len = args[0] && args[0].length > 0 ? Math.min(50, Math.max(parseInt(args[0]), 5)) : Math.min(10, sortedExp.length)

  let text = `
╮──⊰ [👑 قائمة المتصدرين 👑] ⊱──╭

${sortedExp
    .slice(0, len)
    .map(({ jid, exp, credit = 0, bank = 0, level = 0, role = 'مبتدئ' }, i) => {
      let user = users.find(u => u.jid === jid)
      let username = user?.name || 'مجهول'
      let totalgold = (credit || 0) + (bank || 0)

      return `
*#${i + 1}.* 𓆩🌟𓆪
*👤 الاسم:* ${username}
*💎 الخبرة:* ${exp}
*🎯 المستوى:* ${level}
*🏆 الرتبة:* ${role}
*👛 الرصيد:* ${credit}
*🏦 البنك:* ${bank}
*💰 المجموع:* ${totalgold}
───────────────`
    })
    .join('\n')}
    
📊 ترتيبك الحالي: *#${usersExp.indexOf(m.sender) + 1}* من أصل *${usersExp.length}* مستخدم 👑
╯──⊰ [🏦 ⊱──╯
`.trim()

  conn.reply(m.chat, text, m)
}

handler.help = ['الرتبة']
handler.tags = ['xp']
handler.command = /^(الرتبة|الترتيب|المتصدرين)$/i

export default handler

// دوال مساعدة
function sort(property, ascending = true) {
  return (a, b) => (ascending ? a[property] - b[property] : b[property] - a[property])
}

function toNumber(property, _default = 0) {
  return a => ({
    ...a,
    [property]: a[property] === undefined ? _default : a[property],
  })
}

function enumGetKey(a) {
  return a.jid
}