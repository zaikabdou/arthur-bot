import axios from 'axios'
import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply("❀ Please provide a song name or artist.")
    try {
        await m.react('🕒')
        const res = await axios.get(`${global.APIs.adonix.url}/download/spotify?apikey=${global.APIs.adonix.key}&q=${encodeURIComponent(text)}`)
        if (!res.data?.status || !res.data?.song || !res.data?.downloadUrl) throw new Error("Song not found on Adonix.")
        const s = res.data.song
        const data = { 
            title: s.title || "Unknown", 
            artist: s.artist || "Unknown", 
            duration: s.duration || "Unknown", 
            image: s.thumbnail || null, 
            download: res.data.downloadUrl, 
            url: s.spotifyUrl || text 
        }
        const caption = `「✦」Downloading *<${data.title}>*\n\nꕥ Artist » *${data.artist}*\nⴵ Duration » *${data.duration}*\n🜸 Link » ${data.url}`
        const bannerBuffer = data.image ? await (await fetch(data.image)).buffer() : null
        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: '✧ Spotify Music • Powered by ' + dev + ' ✧',
                    body: 'Enjoy your music!',
                    mediaType: 1,
                    mediaUrl: data.url,
                    sourceUrl: data.url,
                    thumbnail: bannerBuffer,
                    showAdAttribution: false,
                    containsAutoReply: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })
        await conn.sendMessage(m.chat, { audio: { url: data.download }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
        await m.react('✔️')
    } catch (err) {
        await m.react('✖️')
        m.reply(`⚠︎ An error occurred.\n> Use *${usedPrefix}report* to notify.\n\n${err.message}`)
    }
}

handler.help = ["spotify"]
handler.tags = ["download"]
handler.command = ["سبوت", "سبوتيفاي"]

export default handler