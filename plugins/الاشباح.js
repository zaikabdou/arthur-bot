let handler = async (m, { conn }) => {
    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants.map(u => u.id);

    // تصفية الأعضاء غير الأدمين
    let sider = participants.filter(userId => {
        const isAdmin = metadata.participants.find(v => v.id === userId)?.admin;
        return !isAdmin; // كل الأعضاء الغير أدمين
    });

    if (sider.length === 0) return conn.reply(m.chat, '⚡️ هذا الجروب نشط ولا يوجد به أشباح 😎', m);

    conn.reply(m.chat, `⚠️ فحص الخمول ⚠️\n\n📋 جروب: ${metadata.subject}\n👥 عدد الأعضاء: ${participants.length}\n\n[ 👻 قائمة الأشباح 👻 ]\n${sider.map(v => '  👉🏻 @' + v.split('@')[0]).join('\n')}`, m, { mentions: sider });
};

handler.command = /^(الاشباح)$/i;
handler.group = true;
export default handler;