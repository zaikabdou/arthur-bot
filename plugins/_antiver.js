let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'))

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
  try {
    // safety: ensure db path exists
    const chatData = (global.db && global.db.data && global.db.data.chats && global.db.data.chats[m.chat]) || {};
    const antiver = chatData.antiver;
    const isBanned = chatData.isBanned;

    // only continue if feature enabled and not banned
    if (!antiver || isBanned) return;
    if (!(m.mtype === 'viewOnceMessageV2' || m.mtype === 'viewOnceMessageV2Extension')) return;

    // pick message payload
    const msg = m.mtype === 'viewOnceMessageV2'
      ? m.message.viewOnceMessageV2.message
      : m.message.viewOnceMessageV2Extension.message;

    const type = Object.keys(msg)[0]; // e.g. 'imageMessage' | 'videoMessage' | 'audioMessage'

    // choose stream type correctly
    const streamType = type === 'imageMessage' ? 'image' : (type === 'videoMessage' ? 'video' : 'audio');

    // download stream
    const mediaStream = await downloadContentFromMessage(msg[type], streamType);
    let buffer = Buffer.from([]);
    for await (const chunk of mediaStream) buffer = Buffer.concat([buffer, chunk]);

    // file length fallback
    const fileLen = (msg[type] && (msg[type].fileLength || msg[type].length)) || buffer.length || 0;
    const fileSize = formatFileSize(fileLen);

    const description = `
✅️ *ممنوع-ارسال-شيئ-للعرض-مرة-واحدة* ✅️

💭 *ما تخفي* ${type === 'imageMessage' ? '`صورة` 📷' : type === 'videoMessage' ? '`فيديو` 🎥' : type === 'audioMessage' ? '`تسجيل صوتي` 🎤' : '*رسالة*'}
- ✨️ *الفاعل:* *@${(m.sender || '').split('@')[0]}*
${msg[type].caption ? `- *رسالة:* ${msg[type].caption}` : ''}
- *الحجم:* ${fileSize}
`.trim();

    // ارسال بناءً على النوع باستخدام sendMessage (متوافق مع Baileys)
    if (type === 'imageMessage' || type === 'videoMessage') {
      const mediaKey = type === 'imageMessage' ? 'image' : 'video';
      const mimetype = type === 'imageMessage' ? 'image/jpeg' : 'video/mp4';
      await conn.sendMessage(m.chat, {
        [mediaKey]: buffer,
        caption: description,
        mimetype
      }, { quoted: m, mentions: [m.sender] });
      return;
    }

    if (type === 'audioMessage') {
      await conn.sendMessage(m.chat, { text: description }, { quoted: m, mentions: [m.sender] });
      await conn.sendMessage(m.chat, {
        audio: buffer,
        fileName: 'error.mp3',
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m });
      return;
    }

  } catch (err) {
    // لا توقف العملية الكلية؛ سجل الخطأ بدلًا من رميه
    console.log('viewOnce handler error:', err);
  }
}
export default handler

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + (sizes[i] || 'Bytes');
}