import fetch from "node-fetch";
import moment from "moment-timezone";
import PhoneNum from "awesome-phonenumber";

let regionNames = new Intl.DisplayNames(['ar'], { type: 'region' });

async function fetchWithRetry(url, retries = 3, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) throw new Error("Rate limit reached");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i < retries - 1) {
        console.log(`[Retry] محاولة ${i + 1} بعد ${delayMs}ms بسبب: ${e.message}`);
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        // لو فشل كل المحاولات
        return {
          message: "⚠️ لم يتم استلام ببيانات",
          image: 'https://i.imgur.com/oZ1p6nD.png'
        };
      }
    }
  }
}

let handler = async (m, { conn, text, usedPrefix, command: cmd }) => {
  try {
    let num = m.quoted?.sender || m.mentionedJid?.[0] || text;
    if (!num) throw `📌 مثال: ${usedPrefix + cmd} @العضو`;
    let rawNumber = num.replace(/\D/g, '');
    num = rawNumber + '@s.whatsapp.net';

    let check = await conn.onWhatsApp(num);
    if (!check || !check[0]?.exists) throw '⛔ المستخدم غير موجود على واتساب';

    let img = await conn.profilePictureUrl(num, 'image').catch(_ => 'https://i.imgur.com/oZ1p6nD.png');
    let bio = await conn.fetchStatus(num).catch(_ => ({}));
    let name = await conn.getName(num);
    let business = await conn.getBusinessProfile(num) || {};

    let format = PhoneNum(`+${rawNumber}`);
    let country = regionNames.of(format.getRegionCode('international')) || 'غير معروف';

    const wid = business.wid || '-';
    const website = business.website || '-';
    const email = business.email || '-';
    const category = business.category || '-';
    const address = business.address || '-';
    const description = business.description || '-';

    const apiUrl = `https://tyson-dev.vercel.app/api/whatsapp?number=${rawNumber}&name=${encodeURIComponent(name || '-')}&bio=${encodeURIComponent(bio?.status || '-')}&business=${Object.keys(business).length ? true : false}&wid=${encodeURIComponent(wid)}&website=${encodeURIComponent(website)}&email=${encodeURIComponent(email)}&category=${encodeURIComponent(category)}&address=${encodeURIComponent(address)}&description=${encodeURIComponent(description)}&imgUrl=${encodeURIComponent(img)}`;

    console.log('[📡 API REQUEST]:', apiUrl);

    const json = await fetchWithRetry(apiUrl);

    await conn.sendMessage(m.chat, {
      image: { url: json.image || img },
      caption: json.message || "⚠️ لم يتم استلام البيانات",
      mentions: [num]
    }, { quoted: m });

  } catch (e) {
    console.error('[❌ ERROR whatsapp.js]', e);
    m.reply(`⚠️ خطأ: ${e.message || e}`);
  }
};

handler.help = ['whatsapp'];
handler.tags = ['tools'];
handler.command = /^(whatsapp|الحساب|حساب|واتس|واتساب)$/i;

export default handler;