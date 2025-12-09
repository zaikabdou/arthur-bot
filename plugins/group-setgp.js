import { makeWASocket } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, text, command, usedPrefix }) => {
    try {
        switch (command) {
            case 'صورة القروب': {   // بدل gpbanner / groupimg
                const q = m.quoted || m
                const mime = (q.msg || q).mimetype || ''
                if (!/image\/(png|jpe?g)/.test(mime)) return m.reply('❀ يجب إرسال صورة لتغيير صورة القروب.')
                const img = await q.download()
                if (!img) return m.reply('❀ فشل تحميل الصورة.')
                await m.react('🕒')
                await conn.updateProfilePicture(m.chat, img)
                await m.react('✔️')
                m.reply('❀ تم تغيير صورة القروب بنجاح.')
                break
            }
            case 'وصف': {   // بدل gpdesc / groupdesc
                if (!args.length) return m.reply('❀ اكتب الوصف الجديد للقروب.')
                await m.react('🕒')
                await conn.groupUpdateDescription(m.chat, args.join(' '))
                await m.react('✔️')
                m.reply('❀ تم تغيير وصف القروب بنجاح.')
                break
            }
            case 'انيا': {   // بدل gpname / groupname
                if (!text) return m.reply('❀ اكتب الاسم الجديد للقروب.')
                await m.react('🕒')
                await conn.groupUpdateSubject(m.chat, text)
                await m.react('✔️')
                m.reply('❀ تم تغيير اسم القروب بنجاح.')
                break
            }
        }
    } catch (e) {
        await m.react('✖️')
        m.reply(`⚠︎ حدث خطأ.\n> استخدم ${usedPrefix}report للإبلاغ.\n\n${e.message}`)
    }
}

handler.help = ['صورة القروب', 'وصف', 'انيا']
handler.command = ['صورة القروب', 'وصف', 'انيا']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler