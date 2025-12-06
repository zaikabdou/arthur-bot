const handler = async (m, { conn, text, usedPrefix, command, args, isROwner }) => {
    if (!isROwner) return
    const bot = conn.user.jid.split('@')[0]
    const users = global.db.data.users
    const chats = global.db.data.chats

    function no(number) { return number.replace(/\s/g, '').replace(/([@+-])/g, '') }

    try {
        let mentionedJid = m.mentionedJid
        let who = mentionedJid?.[0] 
            || m.quoted?.sender 
            || text ? no(text.split(' ')[0]) + '@s.whatsapp.net' 
            : false

        switch (command) {

            case 'بان': {
                if (!who) return conn.reply(m.chat, '❀ يرجى منشن أو اقتباس أو كتابة رقم الشخص الذي تريد حظره من البوت.', m)
                let reason = 'بدون سبب'
                if (mentionedJid?.[0]) {
                    let mentionIdx = args.findIndex(arg => arg.startsWith('@'))
                    let reasonArgs = args.slice(mentionIdx + 1).join(' ')
                    if (reasonArgs.trim()) reason = reasonArgs.trim()
                } else if (m.quoted && args.length) {
                    reason = args.join(' ')
                } else if (text) {
                    const parts = text.trim().split(' ')
                    if (parts.length > 1) reason = parts.slice(1).join(' ')
                }

                if (who === conn.user.jid) return conn.reply(m.chat, `ꕥ @${bot} لا يمكن حظره.`, m, { mentions: [who] })
                if (global.owner.some(x => who === x[0] + '@s.whatsapp.net')) {
                    return conn.reply(m.chat, `ꕥ لا يمكن حظر المالك @${who.split('@')[0]} من @${bot}.`, m, { mentions: [who, bot] })
                }

                if (!users[who]) users[who] = {}
                if (users[who].banned) return conn.reply(m.chat, `ꕥ @${who.split('@')[0]} محظور بالفعل.`, m, { mentions: [who] })

                await m.react('🕒')
                users[who].banned = true
                users[who].bannedReason = reason
                const nameBan = await conn.getName(who)
                await m.react('✔️')
                await conn.reply(m.chat, `❀ ${nameBan} تم حظره.\n> السبب: ${reason}`, m, { mentions: [who] })
                break
            }

            case 'فك بان': {
                if (!who) return conn.reply(m.chat, '❀ يرجى منشن أو كتابة رقم الشخص الذي تريد فك حظره من البوت.', m)
                if (!users[who]) return conn.reply(m.chat, '❀ هذا المستخدم غير موجود في قاعدة البيانات.', m)
                if (!users[who].banned) return conn.reply(m.chat, `ꕥ @${who.split('@')[0]} غير محظور.`, m, { mentions: [who] })

                await m.react('🕒')
                users[who].banned = false
                users[who].bannedReason = ''
                await m.react('✔️')
                const nameUnban = await conn.getName(who)
                await conn.reply(m.chat, `❀ ${nameUnban} تم فك حظره.`, m, { mentions: [who] })
                break
            }

            case 'حظر': {
                if (!who) return conn.reply(m.chat, '❀ يرجى منشن الشخص الذي تريد حظره من رقم البوت.', m)
                await m.react('🕒')
                await conn.updateBlockStatus(who, 'block')
                await m.react('✔️')
                conn.reply(m.chat, `❀ تم حظر @${who.split('@')[0]} من رقم البوت.`, m, { mentions: [who] })
                break
            }

            case 'فك حظر': {
                if (!who) return conn.reply(m.chat, '❀ يرجى منشن الشخص الذي تريد إلغاء حظره من رقم البوت.', m)
                await m.react('🕒')
                await conn.updateBlockStatus(who, 'unblock')
                await m.react('✔️')
                conn.reply(m.chat, `❀ تم إلغاء حظر @${who.split('@')[0]}`, m, { mentions: [who] })
                break
            }

            case 'قائمة بان': {
                await m.react('🕒')
                const bannedUsers = Object.entries(users).filter(([_, data]) => data.banned)
                const bannedChats = Object.entries(chats).filter(([_, data]) => data.isBanned)

                const usersList = bannedUsers.map(([jid]) => `▢ @${jid.split('@')[0]}`)
                const chatsList = bannedChats.map(([jid]) => `▢ ${jid}`)

                const bannedText = `✦ قائمة المستخدمين المحظورين • العدد: ${bannedUsers.length}\n${usersList.join('\n')}\n\n✧ قائمة المجموعات المحظورة • العدد: ${bannedChats.length}\n${chatsList.join('\n')}`.trim()
                const mentions = [...bannedUsers.map(([jid]) => jid)]

                await m.react('✔️')
                conn.reply(m.chat, bannedText, m, { mentions })
                break
            }

            case 'قائمة الحظر': {
                await m.react('🕒')
                const blocklist = await conn.fetchBlocklist()
                let listText = `≡ *قائمة المحظورين من رقم البوت*\n\n*العدد:* ${blocklist.length}\n\n┌─⊷\n`
                for (const i of blocklist) listText += `▢ @${i.split('@')[0]}\n`
                listText += '└───────────'
                await m.react('✔️')
                conn.reply(m.chat, listText, m, { mentions: blocklist })
                break
            }

        }
    } catch (e) {
        await m.react('✖️')
        return conn.reply(m.chat, `⚠︎ حدث خطأ.\n> استخدم *${usedPrefix}report* للإبلاغ عنه.\n\n` + (e.message || e), m)
    }
}

handler.help = ['بان', 'فك بان', 'حظر', 'فك حظر', 'قائمة بان', 'قائمة الحظر']
handler.tags = ['mods']
handler.command = ['بان', 'فك بان', 'حظر', 'فك حظر', 'قائمة بان', 'قائمة الحظر']

export default handler