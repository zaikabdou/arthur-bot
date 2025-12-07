// مضاد الإشراف — ضبط/مراقبة وتلقائي (مصحح ومحسّن)
// ملاحظة: يحتاج البوت أن يكون مشرفًا في المجموعة ليتمكن من إعادة الترقيات أو طرد أحدهم.

let antiAdminChange = global.antiAdminChange || {}; // يخزن الحالة لكل مجموعة (يبقى في الذاكرة خلال الجلسة)
global.antiAdminChange = antiAdminChange;

// أمر تشغيل/إيقاف: /مضاد_الإشراف فتح  أو  /مضاد_الإشراف غلق
let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
  try {
    if (!m.isGroup) return m.reply('*هذا الأمر يعمل في المجموعات فقط!*');
    if (!isAdmin) return m.reply('*الأمر للمشرفين فقط!*');
    if (!isBotAdmin) return m.reply('*يجب أن أكون مشرفًا لأستطيع حماية الإشراف!*');

    const chatId = m.chat;
    const state = (args[0] || '').toString().toLowerCase();

    if (state === 'فتح' || state === 'on' || state === 'enable') {
      antiAdminChange[chatId] = true;
      return m.reply('*✅ تم تفعيل مضاد الإشراف — أي سحب إشراف سيتم التراجع عنه تلقائياً.*');
    } else if (state === 'غلق' || state === 'off' || state === 'disable') {
      antiAdminChange[chatId] = false;
      return m.reply('*❌ تم إيقاف مضاد الإشراف — التغييرات على الإشراف ستتم كما يريد المشرفون.*');
    } else {
      return m.reply(`*استخدم الأمر بالشكل التالي:*\n\n - ${usedPrefix + command} فتح (لتفعيل الحماية)\n - ${usedPrefix + command} غلق (لإيقاف الحماية)`);
    }
  } catch (e) {
    console.error('مضاد الإشراف — خطأ في الأمر:', e);
    return m.reply('*⚠️ حدث خطأ داخلي أثناء تنفيذ الأمر.*');
  }
};

handler.help = ['مضاد_الإشراف فتح/غلق'];
handler.tags = ['group'];
handler.command = ['مضاد_الإشراف'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;

/* ==================== مراقبة تغييرات المشرفين ====================
   يتم التسجيل للحدث عند وجود conn. نوفر دالة تسجيل يمكن استدعاؤها
   مباشرة أو تشتغل تلقائياً لو كان global.conn موجود.
*/

async function handleGroupParticipantsUpdate(conn, update) {
  try {
    const { id /* group JID */, participants = [], action } = update;
    if (!id) return;
    // إذا النظام معطل أو غير مُفعّل للمجموعة لا نفعل شيئًا
    if (!antiAdminChange[id]) return;

    const botJid = conn.user && (conn.user.jid || conn.user.id) ? (conn.user.jid || conn.user.id) : null;
    const developerJid = '213551217759@s.whatsapp.net'; // عدّل إن احتجت

    // محاولات لاستخراج من نفَّذ الفعل — بعض نسخ Baileys قد تقدّم حقل actor/author/executor
    let actor = null;
    if (update.actor) actor = update.actor;
    if (!actor && update.author) actor = update.author;
    if (!actor && update.executor) actor = update.executor;
    if (!actor && update.who) actor = update.who; // أحياناً يكون هناك حقل who
    // إذا كان actor عدد فقط (مثلاً '21355...') ضيف suffix:
    if (actor && !/@/.test(actor)) actor = `${actor}@s.whatsapp.net`;

    // نتعامل مع حالات 'demote' (سحب إشراف) أو 'promote' أو 'remove' حسب ما تريد الحماية
    // هنا نركز على demote — عند سحب إشراف شخص نعيده فوراً، ثم نحاول طرد المُنفِّذ إن تم تحديده.
    if (action === 'demote') {
      for (const p of participants) {
        const demotedJid = p; // jid للشخص الذي نُقِل/سُحب منه الاشراف
        try {
          // إعادة الترقية للمستخدم الذي سُحب منه الاشراف
          // يتطلب هذا أن يكون البوت مشرفًا
          await conn.groupParticipantsUpdate(id, [demotedJid], 'promote');

          // رسالة إعلام للمجموعة
          await conn.sendMessage(
            id,
            {
              text: `⚠️ تم سحب إشراف @${demotedJid.split('@')[0]}، وتمت استعادته تلقائياً لأن مضاد الإشراف مفعل.`,
              mentions: [demotedJid],
            }
          );

          // إذا عرفنا المُنفّذ وحقل actor ليس البوت ولا المطور، نطرده
          if (actor && actor !== botJid && actor !== developerJid && actor !== demotedJid) {
            // تحقق أولاً أن actor ما زال في المجموعة
            try {
              // حاول طرده (حذف المشارك)
              await conn.groupParticipantsUpdate(id, [actor], 'remove');
              await conn.sendMessage(
                id,
                { text: `🚨 تم طرد المشرف @${actor.split('@')[0]} لقيامه بسحب إشراف عضو.` , mentions: [actor] }
              );
            } catch (errRemove) {
              // لو فشل الطرد نبلغ المجموعة (فشل بسبب صلاحيات/حالة)
              await conn.sendMessage(id, {
                text: `⚠️ لم أستطع طرد @${actor.split('@')[0]} — تأكد أني مشرف ولدي صلاحيات كافية أو أن الحساب لم يعد موجوداً.`,
                mentions: actor ? [actor] : []
              });
              console.error('مضاد الإشراف — فشل طرد actor:', errRemove);
            }
          } else if (!actor) {
            // لم نستطع تحديد منفذ الفعل — نكتفي بإصلاح الحالة وإبلاغ المجموعة
            await conn.sendMessage(
              id,
              { text: `ℹ️ لم أتمكن من تحديد من سحب الإشراف، لذا تمت استعادة إشراف @${demotedJid.split('@')[0]} فقط.` , mentions: [demotedJid] }
            );
          }
        } catch (errPromote) {
          console.error('مضاد الإشراف — خطأ أثناء إعادة الترقية أو الإجراء:', errPromote);
          // نبلغ المجموعة أن المحاولة فشلت (ربما لأن البوت ليس مشرفًا فعلًا)
          await conn.sendMessage(id, {
            text: `⚠️ حاولت استعادة إشراف @${demotedJid.split('@')[0]} لكن فشلت. تأكد أن البوت مشرف ولديه صلاحيات الترقيات.`,
            mentions: [demotedJid]
          });
        }
      }
    }

    // لو تريد معالجة 'remove' (طرد عضو) أو 'promote' (ترقية) أضف هنا قواعد مشابهة.
  } catch (e) {
    console.error('مضاد الإشراف — handleGroupParticipantsUpdate خطأ:', e);
  }
}

// دالة التسجيل: تربط الحدث مع conn الحالية
function registerAntiAdminChangeListener(conn) {
  try {
    if (!conn || !conn.ev || !conn.ev.on) {
      console.warn('مضاد الإشراف: conn غير متاحة الآن — لن يتم تسجيل المستمع تلقائياً.');
      return;
    }
    // لتجنّب التسجيل المزدوج
    if (conn._antiAdminChangeRegistered) return;
    conn._antiAdminChangeRegistered = true;

    conn.ev.on('group-participants.update', async (update) => {
      await handleGroupParticipantsUpdate(conn, update);
    });

    console.log('مضاد الإشراف: مستمع group-participants.update مُسجل.');
  } catch (e) {
    console.error('مضاد الإشراف — register error:', e);
  }
}

// حاول التسجيل مباشرة إذا كان global.conn متاح
try {
  if (global.conn) registerAntiAdminChangeListener(global.conn);
} catch (e) {
  // لا نفعل شيء، التسجيل يمكن أن يتم لاحقا يدوياً
  console.error('مضاد الإشراف — فشل محاولة التسجيل التلقائي:', e);
}

// نصيحة: إذا بوتك ينشئ conn بعد تحميل البلاتين يمكنك استدعاء registerAntiAdminChangeListener(conn) يدوياً
export { registerAntiAdminChangeListener };