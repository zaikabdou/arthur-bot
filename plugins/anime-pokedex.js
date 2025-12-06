import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix }) => {
try {
    if (!text) return conn.reply(m.chat, `❀ الرجاء إدخال اسم البوكيمون للبحث عنه.`, m)

    const url = `https://some-random-api.com/pokemon/pokedex?pokemon=${encodeURIComponent(text)}`
    await m.react('🕒') // رد فعل أثناء البحث
    const response = await fetch(url)
    const json = await response.json()

    if (!response.ok) return conn.reply(m.chat, '⚠︎ حدث خطأ أثناء جلب البيانات.', m)

    const aipokedex = `❀ *بوكيديكس - معلومات البوكيمون*\n\n> • *الاسم* » ${json.name}\n> • *الرقم التعريفي* » ${json.id}\n> • *النوع* » ${json.type}\n> • *القدرات* » ${json.abilities}\n> • *الطول* » ${json.height}\n> • *الوزن* » ${json.weight}\n> • *الوصف* » ${json.description}\n\n>`

    conn.reply(m.chat, aipokedex, m)
    await m.react('✔️') // رد فعل عند النجاح

} catch (error) {
    await m.react('✖️') // رد فعل عند حدوث خطأ
    await conn.reply(m.chat, `⚠︎ حدث خطأ.\n> استخدم *${usedPrefix}report* للإبلاغ عنه.\n\n${error.message}`, m)
}}

handler.help = ['بوكيمون']
handler.tags = ['fun']
handler.command = ['بوكيمون']
handler.group = true

export default handler