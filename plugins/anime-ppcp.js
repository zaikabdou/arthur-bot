import fetch from "node-fetch"

let handler = async (m, { conn }) => {
try {
await m.react('🕒')
let data = await (await fetch('https://raw.githubusercontent.com/ShirokamiRyzen/WAbot-DB/main/fitur_db/ppcp.json')).json()
let cita = data[Math.floor(Math.random() * data.length)]
const cowiRes = await fetch(cita.cowo);
const cowiArray = await cowiRes.arrayBuffer();
let cowi = Buffer.from(cowiArray);
await conn.sendFile(m.chat, cowi, '', '*Masculino* ♂', m)
const ciwiRes = await fetch(cita.cewe);
const ciwiArray = await ciwiRes.arrayBuffer();
let ciwi = Buffer.from(ciwiArray);
await conn.sendFile(m.chat, ciwi, '', '*Femenina* ♀', m)
await m.react('✔️')
} catch (error) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`, m)
}}

handler.help = ['ppcouple']
handler.tags = ['anime']
handler.command = ['طقمه', 'اطقم']
handler.group = true

export default handler
