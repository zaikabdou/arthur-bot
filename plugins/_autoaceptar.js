export async function before(m, { conn, isBotAdmin }) {
  if (!m.isGroup || m.fromMe || m.isBaileys) return true
  const chat = global.db.data.chats[m.chat] || {}
  if (!chat.autoAceptar) return true
  if (!isBotAdmin) return true

  try {
    const requests = await conn.groupRequestParticipantsList(m.chat).catch(()=>[])
    const jids = requests.filter(r=>r.jid&&r.jid.includes('@s.whatsapp.net')).map(r=>r.jid)
    if (jids.length>0){
      await conn.groupRequestParticipantsUpdate(m.chat, jids,'approve')
      await conn.sendMessage(m.chat,{ text:`
❍━═━═━═━═━═━═━❍
❍⇇ تم قبول طلبات الانضمام تلقائيًا
❍⇇ العدد ↜ ${jids.length} عضو
❍⇇ بواسطة النظام التلقائي
❍━═━═━═━═━═━═━❍
      `.trim()})
    }

    if (m.messageStubType===172 && m.messageStubParameters?.[0]){
      const jid = m.messageStubParameters[0]
      if (jid.includes('@s.whatsapp.net')) await conn.groupRequestParticipantsUpdate(m.chat,[jid],'approve').catch(()=>{})
    }
  } catch(e){ console.error(e) }

  return true
}