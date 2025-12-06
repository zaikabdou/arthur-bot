let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {  
  if (!m.isGroup) return;

  // حماية: المشرفين والمالكين والبوت نفسه مستثنين
  if (isAdmin || isOwner || isROwner || m.fromMe) return;

  // قراءة إعدادات الشات
  const chat = global.db.data.chats[m.chat] || {};

  // استخراج الـ text الحقيقي سواء كان message أو template أو غيره
  const text = 
    m.text || 
    m.body || 
    m.message?.conversation || 
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    '';

  // كشف الرابط
  const isGroupLink = linkRegex.exec(text) || linkRegex1.exec(text);
  const grupo = "https://chat.whatsapp.com";

  // لو الأدمن أرسل الرابط → فقط تحذير بسيط
  if (isAdmin && chat.antiLink && text.includes(grupo)) {
    return m.reply('*[ ☠️ ] مضاد روابط مفعل ~ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃_~ ، بس انت ادمن فمسموح لك [ ☠️ ]*');
  }

  // المرحلة الأساسية: اكتشاف رابط وطرد
  if (chat.antiLink && isGroupLink && !isAdmin) {

    // لو البوت أدمن → تحقق إن المستخدم لم يرسل رابط نفس القروب
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
      if (text.includes(linkThisGroup)) return;
    }

    // رسالة تحذير
    await conn.sendMessage(
      m.chat,
      { 
        text: `*「 مضاد-روابط 」*\n\n@${m.sender.split('@')[0]} [ 💀 ] أرسلت رابط وسيتم طردك [ 💀 ]`,
        mentions: [m.sender] 
      },
      { quoted: m }
    );

    // لو البوت ليس أدمن → فقط بلّغ
    if (!isBotAdmin) {
      const admins = participants.filter(v => v.admin).map(v => v.id);
      return conn.sendMessage(
        m.chat,
        { 
          text: `*[ 🥲 ] مضاد روابط شغال، لكن انا لست أدمن فلا أستطيع طرده [ 🥲 ]*`,
          mentions: admins
        },
        { quoted: m }
      );
    }

    // هنا البوت أدمن — حذف الرسالة + الطرد
    try {
      await conn.sendMessage(
        m.chat,
        { 
          delete: {
            remoteJid: m.chat,
            id: m.key.id,
            participant: m.key.participant || m.sender
          }
        }
      );
    } catch (e) {
      console.log('Delete error:', e);
    }

    // طرد العضو
    try {
      const res = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if (res?.[0]?.status === "404") return;
    } catch (err) {
      console.log("Kick error:", err);
    }
  }

  return true;
}