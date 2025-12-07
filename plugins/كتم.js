import fs from 'fs';
import path from 'path';

// اسم ملف الحفظ المحلي (يمكن تغييره)
const MUTES_FILE = path.join(process.cwd(), 'mutes.json');

// مساعدة: تحميل حالة الكتم من ملف أو إنشاء ملف جديد
function loadMutesFile() {
  try {
    if (!fs.existsSync(MUTES_FILE)) {
      fs.writeFileSync(MUTES_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    const content = fs.readFileSync(MUTES_FILE, 'utf8');
    return JSON.parse(content || '{}');
  } catch (e) {
    console.error('Mute: failed to load mutes file', e);
    return {};
  }
}

function saveMutesFile(obj) {
  try {
    fs.writeFileSync(MUTES_FILE, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.error('Mute: failed to save mutes file', e);
  }
}

// بداية — تأكد من وجود مساحة للـ global.db.data إذا لم تكن موجودة
if (!global.db) global.db = { data: { users: {}, settings: {} } };
if (!global.db.data) global.db.data = { users: {}, settings: {} };

// تحميل/مزامنة البيانات بين global.db.data.users و ملف MUTES_FILE
const persisted = loadMutesFile();
// Ensure every persisted entry exists in global.db.data.users
for (const jid in persisted) {
  if (!global.db.data.users[jid]) global.db.data.users[jid] = {};
  global.db.data.users[jid].muto = !!persisted[jid].muto;
  // keep warnings if present in persisted, otherwise default to 0 or existing value
  if (typeof persisted[jid].warnings !== 'undefined') global.db.data.users[jid].warnings = persisted[jid].warnings;
  if (typeof global.db.data.users[jid].warnings === 'undefined') global.db.data.users[jid].warnings = 0;
}

// helper: persist current mutes from global.db to file
function persistMutesFromDb() {
  const out = {};
  for (const jid in global.db.data.users) {
    if (global.db.data.users[jid] && typeof global.db.data.users[jid].muto !== 'undefined') {
      out[jid] = { muto: !!global.db.data.users[jid].muto, warnings: global.db.data.users[jid].warnings || 0 };
    }
  }
  saveMutesFile(out);
}

// normalize jid (قبل استخدامه في المقارنات)
function normalizeJid(jid) {
  if (!jid) return jid;
  if (jid.endsWith('@s.whatsapp.net') || jid.endsWith('@g.us')) return jid;
  if (/^\d+$/.test(jid)) return jid + '@s.whatsapp.net';
  return jid;
}

// =================== كود الأوامر: كتم / فك-كتم ===================
const handler = async (message, { conn, command, text, isAdmin }) => {
  // لازم مشرف
  if (!isAdmin) throw "👑 *فقط المسؤولين يمكنهم تنفيذ هذا الأمر*";

  // الحصول على ال jid للهدف (ذكر/رد/كتابة)
  let targetJid = message.mentionedJid && message.mentionedJid[0]
    ? message.mentionedJid[0]
    : message.quoted
      ? message.quoted.sender
      : text;

  if (!targetJid) {
    return conn.reply(message.chat, "❗ *اذكر الشخص الذي ترغب في فك كتمه* ❗", message);
  }

  targetJid = normalizeJid(targetJid.toString());

  // مالك البوت (owner) — استخرج من global.owner الافتراضي عندك
  const botOwner = (global.owner && global.owner[0] && global.owner[0][0]) ? (global.owner[0][0] + "@s.whatsapp.net") : null;
  const botJid = conn?.user?.jid || conn?.user?.id || null;

  // لا تسمح بتغيير حالة الأونر ـــ الأونر لا يُكتم ولا يُفك كتمه (حماية صارمة)
  if (botOwner && targetJid === botOwner) {
    // نحافظ على نفس أسلوب الزخرفة في الرسائل
    throw "😼 *لا يمكنك تغيير حالة كتم صاحب البوت — الأونر محمي دائماً.*";
  }

  // منع تغيير حالة البوت نفسه
  if (botJid && targetJid === botJid) {
    throw "❌️ *لا يمكنك كتم/فك كتم البوت نفسه*";
  }

  // تأكد من وجود بيانات للمستخدم في global.db
  if (!global.db.data.users[targetJid]) {
    global.db.data.users[targetJid] = { muto: false, warnings: 0 };
  }

  const userData = global.db.data.users[targetJid];

  if (command === "فك-كتم") {
    if (!userData.muto) {
      throw "😼 *هذا المستخدم ليس مكتومًا*";
    }

    // فك الكتم وحذف التحذيرات
    userData.muto = false;
    userData.warnings = 0;

    // مزامنة للحفظ
    persistMutesFromDb();

    conn.reply(message.chat,
      `*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🎐❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*\n` +
      `*✅ تم فك كتم هذا الشخص وحذف تحذيراته بنجاح*` + '\n' +
      `*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🎐❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*`,
      message,
      { mentions: [targetJid] }
    );

  } else if (command === "كتم") {
    if (userData.muto) {
      throw "😼 *هذا المستخدم تم كتمه بالفعل*";
    }

    userData.muto = true;

    // مزامنة للحفظ
    persistMutesFromDb();

    conn.reply(message.chat,
      `*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🔕❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*\n` +
      `*✅ تم كتم هذا الشخص بنجاح*` + '\n' +
      `*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🔕❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*`,
      message,
      { mentions: [targetJid] }
    );
  }
};

handler.command = /^(كتم|فك-كتم)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

// =================== فلتر عام لحذف رسائل المكتومين ===================
// يمكنك وضع هذه الدالة في ملف before hook أو كملف plugin منفصل.
// هنا نصّفها كـ export function before ليتم استدعاؤها تلقائياً إن دعم البوت ذلك.
export async function before(m, { conn }) {
  try {
    if (!m || !m.key) return true; // لا تعمل إذا الرسالة فارغة

    // تجاهل رسائل من البوت نفسه أو رسائل النظام
    if (m.isBaileys && m.fromMe) return true;

    // حوّل jid المرسل للصيغة الموحدة
    const sender = normalizeJid(m.sender || (m.key && m.key.participant) || '');

    // لا نفعل شيئًا إذا بيانات المستخدم غير موجودة
    if (!sender) return true;

    // load user data from global.db (أضمن مزامنة)
    if (!global.db || !global.db.data || !global.db.data.users) return true;

    const userData = global.db.data.users[sender];

    // إذا المستخدم مكتوم — نحذف الرسالة فورًا
    if (userData && userData.muto) {
      try {
        // محاولة حذف الرسالة — تعريض للنسخ المختلفة من Baileys:
        // شكل شائع يعمل في كثير من البوتات:
        await conn.sendMessage(m.chat, { delete: m.key });

        // بعض نسخ Baileys تحتاج الشكل التالي (احتياطي):
        // await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: m.key.id, fromMe: false } });

      } catch (e) {
        // لو فشل الحذف، حاول إرسال تحذير بصيغة مخففة (لا نكسر البوت)
        console.error('Mute filter: failed to delete message from muted user', e);
      }
      // أوقف المعالجة الأخرى لهذه الرسالة
      return true;
    }

    return true; // لا تخرّب مسار البوت إن لم يكن المكتوم
  } catch (err) {
    console.error('Mute before hook error:', err);
    return true;
  }
}