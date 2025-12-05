let timeout = 60000
let poin = 500
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakbendera = conn.tebakbendera || {}
    let id = m.chat
    if (id in conn.tebakbendera) {
        conn.reply(m.chat, '❐┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tebakbendera[id][0])
        return
    }
    try {
        let src = JSON.parse(fs.readFileSync(`./src/game/كوره.json`));
        if (src.length === 0) throw "قائمة اللاعبين فارغة."
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `*· • • ━━ ⌝🍄⌞ ━━ • • ·*
*${command.toUpperCase()}*
*🜋↫╎السـؤال ✍🏻⇜『من الاعب ال بالصورة』*
  *🜋↫╎الـوقـت⏳↞ ${(timeout / 1000).toFixed(2)} ┇*
  *استخدم .انسحب للأنسحاب*
  *🜋↫╎الـجـائزة💰↞ ${poin} نقاط┇*
∞┇━━━ •🍄• ━━━┇∞
*✠ ~تــ✍︎ــوقــيــع ↯:~*
『𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃』
     `.trim()
        conn.tebakbendera[id] = [
            await conn.sendFile(m.chat, json.img, '', caption, m),
            json, poin,
            setTimeout(() => {
                if (conn.tebakbendera[id]) conn.reply(m.chat, `❮ ⌛┇انتهي الوقت┇⌛❯\n❐↞┇الاجـابـة✅↞ *${json.name}* ┇`, conn.tebakbendera[id][0])
                delete conn.tebakbendera[id]
            }, timeout)
        ]
    } catch (err) {
        console.error(err)
        conn.reply(m.chat, '❌ حدث خطأ أثناء تحميل السؤال. يرجى المحاولة مرة أخرى في وقت لاحق.', m)
    }
}
handler.help = ['guessflag']
handler.tags = ['game']
handler.command = /^كوره/i

export default handler 
