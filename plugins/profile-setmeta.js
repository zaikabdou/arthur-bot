let handler = async (m, { text, usedPrefix, command }) => {
const ctxErr = (global.rcanalx || {})
const ctxWarn = (global.rcanalw || {})
const ctxOk = (global.rcanalr || {})

const userId = m.sender
if (command === 'setmeta') {
const packParts = text.split(/[\u2022|]/).map(part => part.trim())
if (packParts.length < 2) {
return await conn.reply(m.chat, `❀ من فضلك، اكتب اسم الحزمة والمؤلف الذي تريد استخدامه كافتراضي لملصقاتك.\n> مثال: *${usedPrefix + command} Arlette  • Bot*`, m, ctxErr)
}
const packText1 = packParts[0]
const packText2 = packParts[1]
if (!global.db.data.users[userId]) {
global.db.data.users[userId] = {}
}
const packstickers = global.db.data.users[userId]
packstickers.text1 = packText1
packstickers.text2 = packText2
await global.db.write()
return await conn.reply(m.chat, `❀ تم تحديث اسم الحزمة والمؤلف الافتراضي لملصقاتك.`, m, ctxOk)
}
if (command === 'delmeta') {
if (!global.db.data.users[userId] || (!global.db.data.users[userId].text1 && !global.db.data.users[userId].text2)) {
return await conn.reply(m.chat, `ꕥ لم تقم بتعيين حزمة ملصقات افتراضية لديك.`, m, ctxWarn)
}
const packstickers = global.db.data.users[userId]
delete packstickers.text1
delete packstickers.text2
await global.db.write()
return await conn.reply(m.chat, `❀ تم إعادة تعيين الحزمة والمؤلف الافتراضي لملصقاتك.`, m, ctxOk)
}}

handler.help = ['setmeta', 'delmeta']
handler.tags = ['tools']
handler.command = ['setmeta', 'delmeta']
handler.group = true

export default handler