/**
 * Roulette / رهان (أحمر / أسود)
 *
 * سلوك:
 * - تضغط الرهان: .رهان <المبلغ> <اللون>
 * - يخصم المبلغ فورًا كـ "احتجاز"
 * - عند انتهاء الوقت: الفائز يحصل على مبلغ = 2 * رهان (يعني: يسترجع الرهان + ربح بمقدار الرهان)
 * - الخاسر لا يسترجع شيء (المبلغ مسحوب بالفعل)
 *
 * إعدادات قابلة للتعديل أدناه.
 */

const rouletteState = {} // per chatId -> { bets: [], running: boolean, timerId: Timeout }

const DEFAULT_DURATION = 10_000 // مده الجولة بالمللي ثانية (10s)
const MIN_BET = 500
const MAX_BET = 100000

function normalizeColor(input) {
  if (!input) return null
  const c = input.toString().trim().toLowerCase()
  if (["red", "أحمر", "احمر"].includes(c)) return "red"
  if (["black", "أسود", "اسود"].includes(c)) return "black"
  return null
}

function formatCurrency(n) {
  return `${n}` // عدّل إن أردت فواصل أو رموز
}

async function resolveRouletteForChat(chatId, conn) {
  const state = rouletteState[chatId]
  if (!state || !state.bets || state.bets.length === 0) {
    // تنظيف الحالة
    if (state && state.timerId) clearTimeout(state.timerId)
    delete rouletteState[chatId]
    return
  }

  // اختَر اللون النهائي
  const colors = ["red", "black"]
  const resultColor = colors[Math.floor(Math.random() * colors.length)]

  const winners = []
  const losers = []
  const mentions = []

  // عملية الدفع: للفائزين نضيف 2 * amount (لأن المبلغ خصم مسبقاً)
  for (const bet of state.bets) {
    const userId = bet.user
    // تأكد من وجود صف المستخدم
    if (!global.db) global.db = { data: { users: {} } }
    if (!global.db.data) global.db.data = { users: {} }
    if (!global.db.data.users[userId]) global.db.data.users[userId] = { credit: 0 }

    const userDB = global.db.data.users[userId]

    if (bet.color === resultColor) {
      const payout = bet.amount * 2
      userDB.credit = (userDB.credit || 0) + payout
      winners.push(`🟢 @${userId.split("@")[0]} ربح ${formatCurrency(payout)}`)
      mentions.push(userId)
    } else {
      // الخاسر: المبلغ قد خصم عند الرهان، إذًا لا حاجة لخصم هنا
      losers.push(`🔴 @${userId.split("@")[0]} خسر ${formatCurrency(bet.amount)}`)
      mentions.push(userId)
    }
  }

  // بناء رسالة النتيجة
  let msg = `🎰 *نتيجة الروليت*\nالكرة هبطت على: *${resultColor === 'red' ? 'أحمر' : 'أسود'}*\n\n`
  if (winners.length) {
    msg += `🎉 *الفائزون:*\n${winners.join("\n")}\n\n`
  } else {
    msg += `❌ لا يوجد فائزين هذه الجولة.\n\n`
  }

  msg += `📉 *الخاسرون:*\n${losers.length ? losers.join("\n") : 'لا أحد'}`

  // أرسل النتيجة مع mentions
  try {
    await conn.sendMessage(chatId, { text: msg, mentions }, { quoted: { key: { remoteJid: chatId, fromMe: false, id: 'roulette' }, message: { conversation: 'نتيجة الروليت' } } })
  } catch (e) {
    // احتياطي: ارسال بدون quoted
    await conn.sendMessage(chatId, { text: msg, mentions })
  }

  // تنظيف الحالة
  if (state.timerId) clearTimeout(state.timerId)
  delete rouletteState[chatId]
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  // تحقق بسيط
  if (!args || args.length < 2) {
    throw `✳️ الاستخدام الصحيح:\n${usedPrefix + command} <المبلغ> <اللون>\nمثال: ${usedPrefix + command} 500 أحمر`
  }

  // إعدادات
  const chatId = m.chat
  const sender = m.sender

  // تأكد من وجود قاعدة البيانات للمستخدمين
  if (!global.db) global.db = { data: { users: {} } }
  if (!global.db.data) global.db.data = { users: {} }
  if (!global.db.data.users[sender]) global.db.data.users[sender] = { credit: 0 }

  // قراءة المبلغ واللون
  const amount = parseInt(args[0])
  const color = normalizeColor(args[1])

  if (isNaN(amount) || amount <= 0) throw '🔢 الرجاء إدخال مبلغ صالح بالارقام'
  if (amount < MIN_BET) throw `✳️ الحد الأدنى للرهان هو ${MIN_BET}`
  if (amount > MAX_BET) throw `🟥 الحد الأقصى للرهان هو ${MAX_BET}`
  if (!color) throw '✳️ اختر لون صالح: أحمر أو أسود'

  const userDB = global.db.data.users[sender]
  if ((userDB.credit || 0) < amount) throw '✳️ رصيدك غير كافٍ لوضع هذا الرهان'

  // خصم المبلغ فورًا (حجز)
  userDB.credit = (userDB.credit || 0) - amount

  // تسجيل الرهان ضمن حالة الشات
  if (!rouletteState[chatId]) {
    rouletteState[chatId] = { bets: [], running: false, timerId: null }
  }

  rouletteState[chatId].bets.push({
    user: sender,
    amount,
    color,
    time: Date.now()
  })

  // الإقرار للمراهن
  await m.reply(`✅ تم تسجيل رهانك: ${formatCurrency(amount)} على ${color === 'red' ? 'أحمر' : 'أسود'}\n⏳ يمكنك إضافة رهانات أخرى أو انتظر انتهاء الجولة.`)

  // ابلاغ الشات بالحالة الإجمالية (اختياري: مجموع الرهانات على كل لون)
  try {
    const allBets = rouletteState[chatId].bets
    const totalRed = allBets.filter(b => b.color === 'red').reduce((s, b) => s + b.amount, 0)
    const totalBlack = allBets.filter(b => b.color === 'black').reduce((s, b) => s + b.amount, 0)

    await conn.sendMessage(chatId, { text: `💰 مجموع الرهانات: أحمر=${formatCurrency(totalRed)} | أسود=${formatCurrency(totalBlack)}\n(ستبدأ النتيجة خلال ${Math.round(DEFAULT_DURATION/1000)} ثانية)` }, { quoted: m })
  } catch (e) { /* تجاهل إذا فشل الإرسال الثانوي */ }

  // تشغيل المؤقت مرة واحدة فقط لكل شات
  if (!rouletteState[chatId].running) {
    rouletteState[chatId].running = true
    rouletteState[chatId].timerId = setTimeout(async () => {
      try {
        await resolveRouletteForChat(chatId, conn)
      } catch (e) {
        console.error('خطأ أثناء حل الروليت:', e)
        // في حال فشل، نحاول إرسال رسالة خطأ وإرجاع المبالغ المحتجزة
        try {
          await conn.sendMessage(chatId, { text: 'حدث خطأ أثناء حساب نتيجة الروليت. سيتم استرجاع الرهانات.' }, { quoted: m })
        } catch (_) {}
        // استرجاع المبالغ للمقامرين
        const state = rouletteState[chatId]
        if (state && state.bets) {
          for (const b of state.bets) {
            if (global.db && global.db.data && global.db.data.users[b.user]) {
              global.db.data.users[b.user].credit = (global.db.data.users[b.user].credit || 0) + b.amount
            }
          }
        }
        if (rouletteState[chatId] && rouletteState[chatId].timerId) clearTimeout(rouletteState[chatId].timerId)
        delete rouletteState[chatId]
      }
    }, DEFAULT_DURATION)
  }
}

handler.help = ['رهان <المبلغ> <اللون>']
handler.tags = ['economy']
handler.command = ['رهان', 'roulette', 'bet']
handler.group = true

export default handler