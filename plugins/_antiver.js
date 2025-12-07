// ===[ مضاد العرض مرة واحدة – النسخة الملكية – شغال مع التفعيلات ]===
// ملف: plugins/antiviewonce.js
// يشتغل مع: .فتح مضاد_العرض   |   .قفل مضاد_العرض
// يعتمد على: chat.antiviewonce = true

import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export async function before(m, { conn, isAdmin = false, isBotAdmin = false }) {
  try {
    if (!m.isGroup || m.fromMe || m.isBaileys) return true

    // ضمان بنية الـ DB
    if (!global.db) global.db = { data: { users: {}, chats: {}, settings: {} }, write: global.db?.write }
    const chat = global.db.data?.chats?.[m.chat] || {}
    if (!chat.antiviewonce) return true

    // كشف أنواع viewOnce المتعارف عليها
    const isViewOnce =
      m.mtype === 'viewOnceMessageV2' ||
      m.mtype === 'viewOnceMessageV2Extension' ||
      Boolean(m.message?.viewOnceMessage)

    if (!isViewOnce) return true

    // احصل على محتوى الرسالة الداخلي (متوافق مع عدة أشكال)
    let innerMsg = null
    if (m.mtype === 'viewOnceMessageV2') innerMsg = m.message.viewOnceMessageV2?.message
    else if (m.mtype === 'viewOnceMessageV2Extension') innerMsg = m.message.viewOnceMessageV2Extension?.message
    else if (m.message?.viewOnceMessage) innerMsg = m.message.viewOnceMessage

    if (!innerMsg) return true

    const type = Object.keys(innerMsg)[0] // مثل 'imageMessage' أو 'videoMessage' أو 'audioMessage'
    const mediaMessage = innerMsg[type]
    if (!mediaMessage) return true

    // تحديد نوع الستريم المطلوب للادخال في downloadContentFromMessage
    const streamType = type.includes('image') ? 'image' : type.includes('video') ? 'video' : 'audio'

    // تنزيل المحتوى إلى Buffer
    const stream = await downloadContentFromMessage(mediaMessage, streamType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

    // طول الملف: قد يكون رقم أو كائن protobuf Long
    const fileLenRaw = mediaMessage.fileLength ?? mediaMessage?.fileLength?.low ?? buffer.length
    const fileSize = typeof fileLenRaw === 'number' ? fileLenRaw : (fileLenRaw?.toNumber ? fileLenRaw.toNumber() : buffer.length)
    const size = formatFileSize(fileSize)

    // اقتطاع caption إن وُجد
    const mediaCaption = (mediaMessage.caption || mediaMessage?.contextInfo?.caption || '').toString()

    const caption = `
❍━═━═━═━═━═━═━❍
❍⇇ ممنوع العرض مرة واحدة
❍
❍⇇ النوع ↜ ${type === 'imageMessage' ? 'صورة' : type === 'videoMessage' ? 'فيديو' : 'تسجيل صوتي'}
❍⇇ الفاعل ↜ @${m.sender.split('@')[0]}
${mediaCaption ? `❍⇇ الكتابة ↜ ${mediaCaption}\n` : ''}❍⇇ الحجم ↜ ${size}
❍━═━═━═━═━═━═━❍
    `.trim()

    // حذف الرسالة الأصلية إذا البوت أدمن وواجهة الارسال تدعم ذلك
    if (isBotAdmin) {
      try {
        if (typeof conn.sendMessage === 'function') {
          await conn.sendMessage(m.chat, {
            delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender }
          }).catch(()=>{})
        }
      } catch (e) {
        // تجاهل فشل الحذف
      }
    }

    // إعادة الإرسال بحسب النوع
    try {
      if (type === 'imageMessage') {
        await conn.sendMessage(m.chat, {
          image: buffer,
          caption,
          mentions: [m.sender]
        }, { quoted: m }).catch(()=>{})
      } else if (type === 'videoMessage') {
        await conn.sendMessage(m.chat, {
          video: buffer,
          caption,
          gifPlayback: mediaMessage.gifPlayback || false,
          mentions: [m.sender]
        }, { quoted: m }).catch(()=>{})
      } else if (type === 'audioMessage') {
        // استرجاع mimetype/ptt إذا كانت متاحة
        const mimetype = mediaMessage.mimetype || 'audio/mpeg'
        const ptt = !!(mediaMessage.ptt || mediaMessage.seconds)
        await conn.sendMessage(m.chat, {
          audio: buffer,
          mimetype,
          ptt,
          waveform: mediaMessage.waveform || null
        }, { quoted: m }).catch(()=>{})

        await conn.sendMessage(m.chat, {
          text: caption,
          mentions: [m.sender]
        }, { quoted: m }).catch(()=>{})
      } else {
        // نوع غير متوقع: أرسل كرابط قاعدة / إعلام
        await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender] }, { quoted: m }).catch(()=>{})
      }
    } catch (e) {
      console.error('antiviewonce: resend failed:', e)
    }

  } catch (err) {
    console.error('خطأ في مضاد العرض مرة واحدة:', err)
  }

  return true
}

function formatFileSize(bytes) {
  try {
    if (!bytes || bytes === 0) return '0 بايت'
    const sizes = ['بايت', 'كيلوبايت', 'ميغابايت', 'غيغابايت', 'تيرابايت']
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1)
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  } catch {
    return 'غير معروف'
  }
}