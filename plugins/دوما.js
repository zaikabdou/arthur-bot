import fs from 'fs';
import fetch from 'node-fetch';
import { spawn } from 'child_process';
import path from 'path';

// المسار النسبي
const jsonPath = path.join('src', 'JSON', 'tebaklagu.json');

let handler = async (m, { conn }) => {
    // اقرأ الملف
    let songs = JSON.parse(fs.readFileSync(jsonPath));

    // اختر أغنية عشوائية
    let song = songs[Math.floor(Math.random() * songs.length)];

    // تحميل الأغنية من الرابط
    let response = await fetch(song.link_song);
    let mp3Buffer = Buffer.from(await response.arrayBuffer());

    // تحويل MP3 -> OGG/Opus مباشرة
    const ffmpeg = spawn('ffmpeg', [
        '-i', 'pipe:0',
        '-c:a', 'libopus',
        '-f', 'opus',
        'pipe:1'
    ]);

    ffmpeg.stdin.write(mp3Buffer);
    ffmpeg.stdin.end();

    let chunks = [];
    for await (const chunk of ffmpeg.stdout) {
        chunks.push(chunk);
    }
    let oggBuffer = Buffer.concat(chunks);

    // إرسال كـ voice note
    await conn.sendMessage(m.chat, {
        audio: oggBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        caption: `🎵 أغنية: ${song.jawaban}\n🎤 الفنان: ${song.artist}`
    }, { quoted: m });
}

handler.command = /^جيبها$/i;
export default handler;