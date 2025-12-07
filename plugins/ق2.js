let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let message = `*_:•⪼مـــرحبــــاً بـــكـ/ﻲ يـا ❪${taguser}❫ في قسم الصور_*
*❀✦═══ •『❄️』• ═══✦❀*
> *شرح القسم:•⪼ يحتوي علي صور لشخصيات الانمي المذكوره❪لما تكتب (.شخصيات)راح يعطيك وش متوفر❫ و اوامر تحميل صور و تطقيمات*
*❆━━━━━⊱⎔⌟❄️⌜⎔⊱━━━━━❆*
> *｢❆┊قــــــســـــــم_الــصـور┊❆｣*
*❆━━━━━⊱⎔⌟❄️⌜⎔⊱━━━━━❆*
┊❄️┊:•⪼⌟شخصيات⌜ 
┊❄️┊:•⪼⌟كيوت⌜ 
┊❄️┊:•⪼ ⌟كابلز⌜
┊❄️┊:•⪼ ⌟تطقيم⌜
┊❄️┊:•⪼⌟ساكو⌜
┊❄️┊:•⪼⌟كورومي⌜
┊❄️┊:•⪼ ⌟كانيكي⌜
┊❄️┊:•⪼ ⌟بينترست⌜
┊❄️┊:•⪼ ⌟صور⌜
┊❄️┊:•⪼⌟هيستيا⌜
┊❄️┊:•⪼ ⌟اطقم⌜
*❆━━━━━⊱⎔⌟❄️⌜⎔⊱━━━━━❆*
> ❆ ❯ امر ❪.بينترست❫ يحضر لك صوره من بينترست 
> مثال:•⪼.صور ارثر يجيب لك صوره المطلوبه اي يجيب صوره ارثر 
> ❆ ❯ من الافضل كتابت الطلب بي الانجليزي و الانمي
*❆━━━━━⊱⎔⌟❄️⌜⎔⊱━━━━━❆*
*┊❄️┊البوت:•⪼𝙰𝚁𝚃_𝙱𝙾𝚃*
*┊❄️┊⇦تــ✍︎ــوقــيــع⇇𝙰𝚁𝚃_𝙱𝙾𝚃*`;

  const emojiReaction = '📷';

  try {
    // إرسال الريأكشن
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });

    // إرسال الفيديو مع النص
    await await conn.sendMessage(m.chat, { 
  image: { 
    url: 'https://files.catbox.moe/vkasct.jpg' 
  }, 
  caption: message, 
  mentions: [m.sender] 
});
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الفيديو.' });
  }
};

handler.command = /^(ق2)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;