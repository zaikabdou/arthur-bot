const المطورين = ['213540419314', '104806312050733'];

const handler = async (m, { conn, usedPrefix, command, args }) => {
  const الرقم = m.sender.replace(/[^0-9]/g, '');

  if (!المطورين.includes(الرقم)) {
    return m.reply('⚠️ هذا الأمر مخصص للمطور فقط.');
  }

  const bot = global.db.data.settings[conn.user.jid] || {};
  const تشغيل = /عمل|شغل|تشغيل/i.test(command);
  const ايقاف = /وقف|تعطيل|ايقاف/i.test(command);

  if (تشغيل) {
    bot.antiPrivate = true;
    await m.reply(`✅ تم تشغيل مضاد الخاص بنجاح.\nالآن سيتم حظر أي شخص يرسل للخاص.`);
  } else if (ايقاف) {
    bot.antiPrivate = false;
    await m.reply(`🚫 تم إيقاف مضاد الخاص.\nالآن يمكن للجميع التحدث في الخاص.`);
  } else {
    await m.reply(`❗ استخدم الأوامر التالية:\n\n${usedPrefix}عمل-مضاد-الخاص لتشغيل\n${usedPrefix}وقف-مضاد-الخاص لإيقاف`);
  }
};

handler.help = ['عمل-مضاد-الخاص', 'وقف-مضاد-الخاص'];
handler.tags = ['owner'];
handler.command = /^(عمل-مضاد-الخاص|وقف-مضاد-الخاص)$/i;

export default handler;