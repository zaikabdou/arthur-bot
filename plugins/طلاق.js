import fetch from 'node-fetch';

// تحويل الرقم لمينشن
let toM = a => '@' + a.split('@')[0];

async function handler(m, { conn, groupMetadata }) {
    // مش هنخصم أي حاجة من جواهر أو فلوس هنا، الموضوع هزار وبس!

    // نبدأ بقرعة طريفة عشان نحدد الضحية
    let participants = groupMetadata.participants.map(v => v.id);
    let a = participants[Math.floor(Math.random() * participants.length)];
    let b;
    do {
        b = participants[Math.floor(Math.random() * participants.length)];
    } while (b === a);

    // رابط الصورة اللي عايزين نبعتها
    const imageUrl = 'https://files.catbox.moe/rehlkk.jpg';

    // إرسال الصورة مع الرسالة المرحة
    await conn.sendFile(m.chat, imageUrl, 'image.jpg', 
    `🔥🔥 يا جماعة، دقت ساعة الانتقام!\n${toM(a)}, طلاقها بالتلته لو عندك دم😂\n${toM(b)}, متقلقيش هاجوزك سيد سيدو! 😉\nخلصت الحلقة، اشربوا عصير واتحكوا! 🍹😆`, 
    m, false, { mentions: [a, b] });
}

// معلومات المساعدة والأوامر
handler.help = ['formarpareja'];
handler.tags = ['main', 'fun'];
handler.command = ['طلقني', 'طلاق'];
handler.group = true;

export default handler;