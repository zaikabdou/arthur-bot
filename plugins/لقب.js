import mongoose from "mongoose";

const uri = "mongodb+srv://itachi3mk:mypassis1199@cluster0.zzyxjo3.mongodb.net/?retryWrites=true&w=majority";

// إصلاح إعدادات Mongoose
mongoose.set('strictQuery', false);
mongoose.connect(uri)
  .then(() => console.log("✅ تم الاتصال بـ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃 بنجاح"))
  .catch(error => console.error("❌ خطأ في الاتصال بـ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃:", error));

const bk9Schema = new mongoose.Schema({
  groupId: String,
  userId: String,
  bk9: String
});

const BK9 = mongoose.model("BK9", bk9Schema);

const handler = async (message, { conn, text, command, isAdmin }) => {
  try {
    const chatId = message.chat;
    const senderId = message.sender.split("@")[0];

    if (command === "الالقاب") {
      if (!message.isGroup) return message.reply("〔هذا الأمر يعمل فقط في المجموعات〕");
      if (!isAdmin) return message.reply("〔هذا الأمر للمشرفين فقط〕");

      const nicknames = await BK9.find({ groupId: chatId });
      if (nicknames.length === 0) {
        return message.reply("📌 لا يوجد ألقاب مسجلة حاليًا");
      }

      let response = `📌 عدد الألقاب: *${nicknames.length}*\n\n`;
      nicknames.forEach((entry, i) => {
        response += `${i + 1} - ${entry.bk9}\n`;
      });

      return message.reply(response);
    }

    if (command === "تسجيل") {
      if (!message.isGroup) return message.reply("〔هذا الأمر يعمل فقط في المجموعات〕");
      if (!isAdmin) return message.reply("〔هذا الأمر للمشرفين فقط〕");
      if (!message.mentionedJid || !text.trim()) {
        return message.reply("📌 مثال:\n`.تسجيل @عضو لقب`");
      }

      const mentionedUser = message.mentionedJid[0].replace("@s.whatsapp.net", "");
      const nickname = text.trim().split(" ").slice(1).join(" ");

      if (!nickname) return message.reply("📌 مثال:\n`.تسجيل @عضو لقب`");

      const existingNickname = await BK9.findOne({ bk9: nickname, groupId: chatId });
      if (existingNickname) {
        return message.reply(`⚠️ اللقب "${nickname}" مأخوذ مسبقًا`);
      }

      await BK9.findOneAndUpdate(
        { userId: mentionedUser, groupId: chatId },
        { bk9: nickname },
        { upsert: true }
      );

      return message.reply(`✨ تم تسجيل لقب: *${nickname}*`);
    }

    if (command === "حذف_لقب") {
      if (!message.isGroup) return message.reply("〔هذا الأمر يعمل فقط في المجموعات〕");
      if (!isAdmin) return message.reply("〔هذا الأمر للمشرفين فقط〕");
      if (!text.trim()) return message.reply("📌 اكتب اللقب لحذفه");

      const deletion = await BK9.deleteOne({ bk9: text.trim(), groupId: chatId });
      return deletion.deletedCount > 0
        ? message.reply("🗑️ تم حذف اللقب بنجاح")
        : message.reply("⚠️ اللقب غير موجود");
    }

    if (command === "لقبي") {
      const userNickname = await BK9.findOne({ userId: senderId, groupId: chatId });
      return userNickname
        ? message.reply(`🎯 لقبك: *${userNickname.bk9}*`)
        : message.reply("⚠️ لا لقب لك بعد");
    }

    if (command === "لقبه") {
      if (!message.mentionedJid?.length) {
        return message.reply("📌 منشن شخصًا لمعرفة لقبه");
      }

      const targetUser = message.mentionedJid[0].replace("@s.whatsapp.net", "");
      const data = await BK9.findOne({ userId: targetUser, groupId: chatId });
      return data
        ? message.reply(`🎯 لقبه: *${data.bk9}*`)
        : message.reply("⚠️ لا لقب له مسجل");
    }

    if (command === "لقب") {
      if (!text.trim()) return message.reply("📌 اكتب لقبًا للتحقق منه");
      const exists = await BK9.findOne({ bk9: text.trim(), groupId: chatId });
      return exists
        ? message.reply("⚠️ اللقب مأخوذ")
        : message.reply("✨ اللقب متاح");
    }

  } catch (error) {
    console.error("❌ خطأ:", error);
    message.reply("⚠️ حدث خطأ غير متوقع");
  }
};

handler.command = ["الالقاب", "تسجيل", "لقبي", "لقبه", "حذف_لقب", "لقب"];
handler.tags = ["BK9"];

export default handler;