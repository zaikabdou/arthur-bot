const handler = async (m, { conn, text, usedPrefix, command, args, isROwner }) => {
if (!isROwner) return
const bot = conn.user.jid.split('@')[0]
const users = global.db.data.users
const chats = global.db.data.chats
function no(number) { return number.replace(/\s/g, '').replace(/([@+-])/g, '') }
try {
let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : text ? no(text.split(' ')[0]) + '@s.whatsapp.net' : false
switch (command) {

case 'banned': {
if (!who) return conn.reply(m.chat, '❀ يرجى منشن أو اقتباس أو كتابة رقم الشخص الذي تريد حظره من البوت.', m)
var reason = 'بدون سبب'
if (mentionedJid && mentionedJid[0]) {
var mentionIdx = args.findIndex(arg => arg.startsWith('@'))
var reasonArgs = args.slice(mentionIdx + 1).join(' ')
if (reasonArgs.trim()) reason = reasonArgs.trim()
} else if (m.quoted) {
if (args.length) reason = args.join(' ')
} else if (text) {
var parts = text.trim().split(' ')
if (parts.length > 1) reason = parts.slice(1).join(' ')
}
if (who === conn.user.jid) return conn.reply(m.chat, `ꕥ @${bot} لا يمكن حظره.`, m, { mentions: [who] })
if (global.owner.some(function (x) { return who === x[0] + '@s.whatsapp.net' })) {
return conn.reply(m.chat, `ꕥ لا يمكنني حظر المالك @${who.split('@')[0]} من *@${bot}*.`, m, { mentions: [who, bot] })
}
if (!users[who]) users[who] = {}
if (users[who].banned) return conn.reply(m.chat, `ꕥ @${who.split('@')[0]} محظور بالفعل.`, m, { mentions: [who] })
await m.react('🕒')
users[who].banned = true
users[who].bannedReason = reason
var nameBan = await conn.getName(who)
await m.react('✔️')
await conn.reply(m.chat, `❀ ${nameBan} تم حظره.\n> السبب: ${reason}`, m, { mentions: [who] })
await conn.reply(`${suittag}@s.whatsapp.net`, `❀ ${nameBan} تم حظره بواسطة ${await conn.getName(m.sender)}\n> ✦ السبب: ${reason}`, m)
break
}

case 'unban': {
if (!who) return conn.reply(m.chat, '❀ يرجى منشن أو كتابة رقم الشخص الذي تريد فك حظره من البوت.', m)
if (!users[who]) return m.reply('❀ هذا المستخدم غير موجود في قاعدة البيانات.', m)
if (!users[who].banned) return m.reply(`ꕥ @${who.split('@')[0]} غير محظور.`, m, { mentions: [who] })
await m.react('🕒')
users[who].banned = false
users[who].bannedReason = ''
await m.react('✔️')
let nameUnban = await conn.getName(who)
await conn.reply(m.chat, `❀ ${nameUnban} تم فك حظره.`, m, { mentions: [who] })
await conn.reply(`${suittag}@s.whatsapp.net`, `❀ ${nameUnban} تم فك حظره بواسطة ${await conn.getName(m.sender)}.`, m)
break
}

case 'block': {
if (!who) return conn.reply(m.chat, '❀ يرجى منشن الشخص الذي تريد حظره من رقم البوت.', m)
await m.react('🕒')
await conn.updateBlockStatus(who, 'block')
await m.react('✔️')
conn.reply(m.chat, `❀ تم حظر @${who.split('@')[0]} من رقم البوت.`, m, { mentions: [who] })
break
}

case 'unblock': {
if (!who) return conn.reply(m.chat, '❀ يرجى منشن الشخص الذي تريد إلغاء حظره من رقم البوت.', m)
await m.react('🕒')
await conn.updateBlockStatus(who, 'unblock')
await m.react('✔️')
conn.reply(m.chat, `❀ تم إلغاء حظر @${who.split('@')[0]}`, m, { mentions: [who] })
break
}

case 'banlist': {
await m.react('🕒')
const bannedUsers = Object.entries(users).filter(([_, data]) => data.banned)
const bannedChats = Object.entries(chats).filter(([_, data]) => data.isBanned)

const usersList = bannedUsers.map(([jid]) => {
const num = jid.split('@')[0]
return `▢ @${num}`
})

const chatsList = bannedChats.map(([jid]) => {
return `▢ ${jid}`
})

const bannedText = `✦ قائمة المستخدمين المحظورين • العدد: ${bannedUsers.length}\n${usersList.join('\n')}\n\n✧ قائمة المجموعات المحظورة • العدد: ${bannedChats.length}\n${chatsList.join('\n')}`.trim()
const mentions = [...bannedUsers.map(([jid]) => jid), ...bannedChats.map(([jid]) => jid)]

await m.react('✔️')
conn.reply(m.chat, bannedText, m, { mentions })
break
}

case 'blocklist': {
await m.react('🕒')
const blocklist = await conn.fetchBlocklist()
let listText = `≡ *قائمة المحظورين من رقم البوت*\n\n*العدد:* ${blocklist.length}\n\n┌─⊷\n`

for (const i of blocklist) {
let num = i.split('@')[0]
listText += `▢ @${num}\n`
}

listText += '└───────────'
await m.react('✔️')
conn.reply(m.chat, listText, m, { mentions: blocklist })
break
}

}} catch (e) {
await m.react('✖️')
return m.reply(`⚠︎ حدث خطأ.\n> استخدم *${usedPrefix}report* للإبلاغ عنه.\n\n` + (e.message || e))
}}

handler.help = ['بان', 'فك بان', 'حظر', 'فك حظر', 'قائمة بان', 'قائمة الحظر']
handler.tags = ['mods']
handler.command = ['بان', 'فك بان', 'حظر', 'فك حظر', 'قائمة بان', 'قائمة الحظر']

export default handler