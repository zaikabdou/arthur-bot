// تـم الـتـطـويـر بـواسـطـه مـونـتـي 💚
// امسح بيانات كل المسجلين - يتطلب التأكيد arg = "تأكيد"

const allowedNumbers = [
  '213773231685@s.whatsapp.net',
  '213551217759@s.whatsapp.net'
]

const handler = async (m, { conn, args }) => {
  // صلاحية
  if (!allowedNumbers.includes(m.sender)) {
    await conn.reply(m.chat, '❌ ⇦ ≺غير مسموح لك بتنفيذ هذا الأمر≻', m)
    return
  }

  // تأكيد
  const confirm = (args && args[0]) ? args[0].toString().trim() : ''
  if (confirm !== 'تأكيد') {
    return conn.reply(m.chat,
`⚠️ ⇦ ≺أمر خطير: سيتم مسح بيانات التسجيل لجميع المستخدمين!≻

إذا كنت متأكدًا نفذ الأمر بهذا الشكل:
• .مسح_السجلات تأكيد

(يجب أن تكتب كلمة "تأكيد" حرفياً لتأكيد العملية)`, m)
  }

  try {
    if (!global.db || !global.db.data || !global.db.data.users) {
      await conn.reply(m.chat, '❌ ⇦ ≺قاعدة البيانات غير متوفرة أو هيكلها غير صحيح!≻', m)
      return
    }

    const users = global.db.data.users
    let count = 0

    for (const jid of Object.keys(users)) {
      const u = users[jid]
      if (u && u.registered) {
        // احذف الحقول المرتبطة بالتسجيل
        delete u.registered
        delete u.name
        delete u.age
        delete u.regTime
        delete u.number // إن وُجد حقل رقم أو ما شابه
        // إن أردت إزالة كائن المستخدم بالكامل استبدل ما فوق بـ: delete global.db.data.users[jid]
        count++
      }
    }

    // حاول الحفظ إن كانت قاعدة البيانات تدعم الكتابة
    try {
      if (typeof global.db.write === 'function') await global.db.write()
      else if (typeof global.db.save === 'function') await global.db.save()
    } catch (e) {
      console.error('failed to persist db:', e)
    }

    // رد زخرفي
    const res = `
╮ ⊰✫⊱─⊰✫⊱─⊰✫⊱╭
🦋⃟ᴠͥɪͣᴘͫ • ⇦ ≺تمت عملية التنظيف≻
┘⊰✫⊱─⊰✫⊱─⊰✫⊱└

𓍯𓂃 تم مسح بيانات التسجيل لعدد: 〘 ${count} 〙 مستخدم/ـة
𓍯𓂃 ملاحظة: تم التخلص من حقول التسجيل فقط (name, age, regTime, registered).
`.trim()

    await conn.reply(m.chat, res, m)
  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, `❌ ⇦ حدث خطأ أثناء عملية المسح:\n${err.message || err}`, m)
  }
}

handler.help = ['مسح_السجلات']
handler.tags = ['owner']
handler.command = /^(مسح_السجلات|clear_regs)$/i

export default handler