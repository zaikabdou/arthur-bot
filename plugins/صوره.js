import axios from 'axios';

const _baileys = await import('@whiskeysockets/baileys');
const baileys = _baileys.default ?? _baileys;
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = baileys;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let handler = async (message, { conn, text }) => {
  try {
    if (!text) return conn.reply(message.chat, "[❗] *ما الذي تريد البحث عنه؟*", message);

    // تفاعل بصري فورًا
    await conn.sendMessage(message.chat, { react: { text: '🔎', key: message.key } }).catch(() => {});

    // جلب بيانات من Pinterest (encoded)
    const query = encodeURIComponent(text);
    const url = `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=${encodeURIComponent(JSON.stringify({
      options: { isPrefetch: false, query: text, scope: "pins", no_fetch_context_on_resource: false },
      context: {}
    }))}&_=${Date.now()}`;

    const { data: apiRaw } = await axios.get(url, { timeout: 10000 }).catch(() => ({ data: null }));
    const resource = apiRaw?.resource_response ?? apiRaw;
    const results = resource?.data?.results ?? resource?.data ?? [];

    if (!Array.isArray(results) || results.length === 0) {
      return conn.sendMessage(message.chat, { text: `⚠️ لم يتم العثور على صور للبحث: *${text}*` }, { quoted: message });
    }

    // جمع روابط الصور (مع حماية من عناصر غير متوقعة)
    const imageUrls = results.map(r => {
      try {
        return r?.images?.orig?.url || r?.images?.["236x"]?.url || r?.image?.url || null;
      } catch { return null; }
    }).filter(Boolean);

    if (imageUrls.length === 0) {
      return conn.sendMessage(message.chat, { text: `⚠️ لم أجد روابط صور صالحة للبحث: *${text}*` }, { quoted: message });
    }

    shuffleArray(imageUrls);
    const selected = imageUrls.slice(0, Math.min(10, imageUrls.length)); // خذ حتى 10 صور للكاروسيل

    // بناء البطاقات (cards)
    const cards = [];
    let idx = 1;
    for (const imgUrl of selected) {
      // جهز imageMessage عبر upload helper
      const media = await prepareWAMessageMedia({ image: { url: imgUrl } }, { upload: conn.waUploadToServer }).catch(() => null);
      if (!media?.imageMessage) continue;

      const title = `صورة ${idx++}`;
      const footerText = "> ♡┆𖧷₊˚˖𓍢ִ🍓𝙰𝚁𝚃_𝙱𝙾𝚃.🎀༘⋆ﾟ＊┆♡";

      const card = proto.Message.InteractiveMessage.CarouselMessage.Card.fromObject({
        title,
        description: `بحث: ${text}`,
        image: media.imageMessage,
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: footerText }),
        buttonText: "عرض",
        // call-to-action اختياري: رابط البحث على Pinterest
        ctatext: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(text)}`
      });

      // بعض نسخ Baileys تتطلب بنية مختلفة للـ cards داخل carousel
      // لذلك نبني عنصر مطابق للـ proto used later
      cards.push({
        title,
        description: `بحث: ${text}`,
        header: { hasMediaAttachment: true, imageMessage: media.imageMessage },
        footer: { text: footerText },
        nativeFlow: { button: { displayText: "عرض", url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(text)}` } }
      });
    }

    if (cards.length === 0) {
      return conn.sendMessage(message.chat, { text: "⚠️ فشل تجهيز صور للعرض." }, { quoted: message });
    }

    // جهز محتوى الرسالة التفاعلية (كاروسيل)
    const interactive = proto.Message.InteractiveMessage.fromObject({
      body: proto.Message.InteractiveMessage.Body.fromObject({ text: `[✅] نتائج البحث: ${text}` }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "🔎 تم جلب النتائج" }),
      header: proto.Message.InteractiveMessage.Header.fromObject({ hasMediaAttachment: false }),
      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
        cards: cards.map(c => proto.Message.InteractiveMessage.CarouselMessage.Card.fromObject({
          title: c.title,
          description: c.description,
          footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: c.footer.text }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: true,
            imageMessage: c.header.imageMessage
          }),
          buttonText: "عرض"
        }))
      })
    });

    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: interactive
        }
      }
    }, { quoted: message });

    await conn.relayMessage(message.chat, messageContent.message, { messageId: messageContent.key?.id || message.key.id });
  } catch (err) {
    console.error('pinterest handler error:', err);
    try {
      await conn.sendMessage(message.chat, { text: `⚠️ حدث خطأ أثناء جلب الصور: ${err?.message || String(err)}` }, { quoted: message });
    } catch {}
  }
};

handler.help = ['جلب <نص>'];
handler.tags = ['downloader'];
handler.command = /^(جلب)$/i;

export default handler;