import { toDataURL } from 'qrcode'
let handler = async (m, { text, conn }) => {
if (!text) throw `*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🍬❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*\n*｢🍷｣⇇ضـع الـنـص الـذي تـريـد تـحـويـلـه الـي كـود*\n*❍━━━══━━❪🍄❫━━══━━━❍*\n*❪🍄❫↜مـثـال⇇┊.كـ↜ـود 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃┊\n*❍━━━══━━❪🍄❫━━══━━━❍*`
conn.sendFile(m.chat, await toDataURL(text.slice(0, 2048), { scale: 8 }), 'qrcode.png', '*❍━━━══━━❪🍄❫━━══━━━❍*\n*｢🍨｣⇇تـم تـنـفـيـذ طـلـبـك بـي نـجـاح*\n*❍━━━══━━❪🍄❫━━══━━━❍*', m)
}
handler.help = ['', 'code'].map(v => 'qr' + v + ' <teks>')
handler.tags = ['tools']
handler.command = /^qr(code)?|كود|باركود$/i
export default handler