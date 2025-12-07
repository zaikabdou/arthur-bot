import fetch from 'node-fetch'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const caption = `
*↲مـطـور  ⚡𝙰𝚁𝚃_𝙱𝙾𝚃*

*مـرًحـبا بـك فـي شـات مـطـوري 🌋 ➭*

*⏎ 𝙰𝚁𝚃_𝙱𝙾𝚃 ⚡➭*
  
 *⤦⤥⏎⤥*
  *⤦⤥⏎⤥*
  *⤦⤥⏎⤥*
  *⤦⤥⏎⤥*
  *⤦⤥⏎⤥*

𝐎𝐖𝐄𝐍𝐀𝐑  𝑨𝑩𝑫𝑶𝑼 🩸
`.trim()

  const responseMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "𝙰𝚁𝚃𝙷𝚄𝚁 ⚡"
    },
    message: {
      locationMessage: {
        name: "✪┋𝙰𝚁𝚃𝙷𝚄𝚁☞𝙱𝙾𝚃┋✪ ✓",
        const thumbRes = await fetch('https://qu.ax/bHS3c');
const thumbArray = await thumbRes.arrayBuffer();
jpegThumbnail: Buffer.from(thumbArray),
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;𝙰𝚁𝚃_𝙱𝙾𝚃;;;
FN:𝙰𝚁𝚃_𝙱𝙾𝚃
ORG:𝙰𝚁𝚃𝙷𝚄𝚁 𝚃𝙴𝙰𝙼
TITLE:
item1.TEL;waid=213551217759:+213 551217759
item1.X-ABLabel:𝙰𝚁𝚃𝙷𝚄𝚁 𝚂𝚄𝙿𝙿𝙾𝚁𝚃
X-WA-BIZ-DESCRIPTION:Official 𝙰𝚁𝚃_𝙱𝙾𝚃 Verified Service
X-WA-BIZ-NAME: 𝙰𝚁𝚃_𝙱𝙾𝚃
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  // إرسال الرسالة الأصلية مع التوثيق والمعاينة
  await conn.sendMessage(
    m.chat,
    {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: "✪┋𝙰𝚁𝚃_𝙱𝙾𝚃┋✪",
          body: "عــبــدو❄️👑",
          mediaType: 1,
          thumbnailUrl: "https://qu.ax/bHS3c",
          sourceUrl: "https://wa.me/213551217759",
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: responseMessage }
  )

  // إرسال نفس الرسالة لكن مع زر المطور تحتها
  const buttonMsg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: '*𝙱𝚈 𝙰𝙱𝙳𝙾𝚄 🩸*' },
            footer: { text: '𝙰𝚁𝚃_𝙱𝙾𝚃'},
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: '≺🩸╎الــمـطـور ╎🩸≺',
                    url: 'https://wa.me/213551217759'
                  })
                }
              ]
            }
          }
        }
      }
    },
    {}
  )

  await conn.relayMessage(m.chat, buttonMsg.message, {})
}

handler.command = /^(المطور)$/i
export default handler