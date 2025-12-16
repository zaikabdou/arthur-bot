// ===[ قبول طلبات الانضمام تلقائيًا - before handler ]===
// ملف: plugins/autoaccept-before.js
// الشكل: export async function before(m, { conn, isBotAdmin }) { ... }

export async function before(m, { conn, isBotAdmin }) {
  try {
    // تنفيذ فقط داخل الجروبات واذا ليست رسالة من البوت أو من مكتبة البايلس
    if (!m.isGroup || m.fromMe || m.isBaileys) return true

    // تأمين الوصول للـ DB
    global.db = global.db || { data: { chats: {}, users: {}, settings: {} } }
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.settings = global.db.data.settings || {}

    const chat = global.db.data.chats[m.chat] ||= {}
    const botSettings = global.db.data.settings[conn.user?.jid] ||= {}

    // دعم مفاتيح مختلفة (عربي/اسباني/انجليزي) احتياطياً
    const enabled = !!(chat.autoAccept || chat.autoAceptar || botSettings.autoAccept || botSettings.autoAceptar)

    if (!enabled) return true // اذا الخاصية مطفلة، ما نعمل شيئ

    // لو البوت مش أدمن ما نقدر نوافق تلقائياً
    // isBotAdmin ممكن يجي من الـ framework كحقل جاهز
    let botIsAdmin = !!isBotAdmin

    // حاول نتحقق من الميتاداتا لو لازم
    const metadata = await conn.groupMetadata(m.chat).catch(() => null)
    if (!botIsAdmin && metadata && Array.isArray(metadata.participants)) {
      const normalize = id => (id || '').toString().replace(/:\d+/, '')
      const botId = normalize(conn.user?.id || conn.user?.jid || '')
      botIsAdmin = metadata.participants.some(p => {
        const pid = normalize(p.id)
        return pid === botId && (p.admin || p.isAdmin || p.isSuperAdmin)
      })
    }

    if (!botIsAdmin) {
      // نُخطر الأدمن/المجموعة إن البوت ليس أدمن ولا يمكنه القبول
      try {
        await conn.sendMessage(m.chat, {
          text: `⚠️ ميزة القبول التلقائي مفعّلة لكنني لست أدمن فأستطيع إشعار المشرفين فقط.`
        }, { quoted: m })
      } catch {}
      return true
    }

    // جمع الطلبات: بعض إصدارات المكتبة توفر groupRequestParticipantsList
    let jids = []

    if (typeof conn.groupRequestParticipantsList === 'function') {
      try {
        const requests = await conn.groupRequestParticipantsList(m.chat).catch(() => [])
        if (Array.isArray(requests)) {
          const good = requests.filter(r => r && r.jid && r.jid.includes('@s.whatsapp.net')).map(r => r.jid)
          jids.push(...good)
        }
      } catch (e) {
        // تجاهل، نحاول الطرق الأخرى
      }
    }

    // بعض النداءات يأتون كـ messageStubType === 172 (طلب فردي)
    if (m.messageStubType === 172 && Array.isArray(m.messageStubParameters) && m.messageStubParameters[0]) {
      const jid = m.messageStubParameters[0]
      if (typeof jid === 'string' && jid.includes('@s.whatsapp.net')) jids.push(jid)
    }

    // إزالة التكرار
    jids = [...new Set(jids)]

    if (jids.length === 0) return true

    // حاول الموافقة على الطلبات
    try {
      // بعض المكتبات تستخدم groupRequestParticipantsUpdate أو groupParticipantsUpdate with 'approve'
      if (typeof conn.groupRequestParticipantsUpdate === 'function') {
        await conn.groupRequestParticipantsUpdate(m.chat, jids, 'approve').catch(() => {})
      } else if (typeof conn.groupParticipantsUpdate === 'function') {
        // fallback لبعض الإصدارات: قد تستعمل نفس الدالة مع نوع approve
        await conn.groupParticipantsUpdate(m.chat, jids, 'approve').catch(() => {})
      } else {
        // لو لا توجد دوال للموافقة، نعيد رسالة تنبيه
        await conn.sendMessage(m.chat, { text: `✅ تم اكتشاف طلبات (${jids.length}) لكن هذه نسخة البوت لا تدعم الموافقة البرمجية.` })
        return true
      }

      // إعلام المجموعة بعدد المقبولين
      await conn.sendMessage(m.chat, {
        text: `
❍━═━═━═━═━═━═━❍
❍⇇ تم قبول طلبات الانضمام تلقائيًا
❍⇇ العدد ↜ ${jids.length} عضو
❍⇇ بواسطة النظام التلقائي
❍━═━═━═━═━═━═━❍
        `.trim()
      })

    } catch (e) {
      console.error('autoaccept approve error:', e)
    }

  } catch (err) {
    console.error('autoaccept.before error:', err)
  }

  return true
}