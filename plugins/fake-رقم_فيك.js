import fetch from "node-fetch";
import cheerio from "cheerio";
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, command, usedPrefix }) => {

    // تأكد من أن النص ليس undefined
    text = (text || '').trim();

    let menu = `╮────────────────────────╭ـ\n│مرحبا : ~@${(m.sender || '').split("@")[0]}~\n╯────────────────────────╰ـ \n`;

    let pp = 'https://files.catbox.moe/9qxiwh.jpg';

    const cap = `${menu}\n╮────────────────────────╭ــ\n│ *أنا خدمة Fake Number Ai*\n│ خدمة قادرة على صنع الأرقام الوهمية.\n│[دولة] لعرض قائمة الدول.\n│[أرقام] لعرض قائمة الأرقام للدولة.\n│[رسائل] لعرض قائمة الرسائل للرقم \n│[كود] لنسخ كود الرسالة المحددة\n╯────────────────────────╰ـ`;

    let lister = ["دولة", "أرقام", "رسائل", "كود"];

    const link = 'https://temporary-phone-number.com';
    const link2 = 'https://temporary-phone-number.com/countrys/';

    let [feature, ...args] = text.split(/\s+/);
    feature = feature || '';
    let additionalLink = args.join(" ").trim();

    if (!lister.includes(feature)) {
        return conn.sendButton(m.chat, cap, '𝐁𝐘┋ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃 ┋', pp, [['دولـة', `${usedPrefix + command} دولة`]], null, null, m);
    }

    if (feature === "دولة") {
        try {
            let response = await fetch(link2);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            let html = await response.text();
            const $ = cheerio.load(html);

            let countryLinks = [];
            $('a.checkout-box').each((i, el) => {
                const href = $(el).attr('href');
                const countryName = $(el).text().trim();

                if (href) {
                    const parts = countryName.split('\n').map(p => p.trim()).filter(Boolean);
                    let name = parts[0] || countryName;
                    let number = parts[1] ? parts[1].replace(/\s+/g, '') : '';
                    countryLinks.push({ name, number, shortLink: href, fullLink: `${link}${href}` });
                }
            });

            let heager = [];
            for (const v of countryLinks) {
                heager.push({
                    header: v.number || v.name,
                    title: v.name,
                    id: `${usedPrefix + command} أرقام ${v.fullLink}`,
                    description: `قائمة أرقام دولة ${v.name}`
                });
            }

            const media = await prepareWAMessageMedia({ image: { url: pp } }, { upload: conn.waUploadToServer });

            const caption = '╮────────────────────────╭ـ\n│ *قائمة الدول :*\n╯────────────────────────╰ـ\n';

            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: { text: caption },
                            footer: { text: '𝐁𝐘┋ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃┋' },
                            header: {
                                hasMediaAttachment: true,
                                imageMessage: media.imageMessage,
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({
                                            title: 'قائـمة الـدول',
                                            sections: [
                                                {
                                                    title: 'قائمة الدول',
                                                    highlight_label: '🇪🇬',
                                                    rows: heager
                                                }
                                            ]
                                        }),
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: `{"display_text": "الرئيسية", "id": "${usedPrefix + command}"}`
                                    }
                                ],
                                messageParamsJson: "",
                            },
                        },
                    },
                }
            }, { userJid: conn.user.jid, quoted: m });

            return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

        } catch (error) {
            console.log(error);
            return conn.sendButton(m.chat, `╮────────────────────────╭ـ\n│ حدث خطأ أثناء جلب البيانات. حاول مرة أخرى لاحقًا.\n╯────────────────────────╰ـ `, '𝐁𝐘┋ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃┋', pp, [['حاول مجددا', `${usedPrefix + command} دولة`]], null, null, m);
        }
    } else if (feature === "أرقام") {
        if (!additionalLink) {
            return conn.sendMessage(m.chat, { text: "يرجى إدخال رابط بعد الأمر \"أرقام\"." }, { quoted: m });
        }

        try {
            let response = await fetch(additionalLink);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            let html = await response.text();
            const $ = cheerio.load(html);

            let numberLinks = [];
            $('.col-sm-6.col-md-4.col-lg-3.col-xs-12').each((i, el) => {
                const href = $(el).find('a').attr('href');
                const numberText = $(el).find('.info-box-number').text().trim();
                const latestText = $(el).find('.info-box-time').text().trim();

                if (href && numberText) {
                    numberLinks.push({ number: numberText, shortLink: href, fullLink: `${link}${href}`, latest: latestText });
                }
            });

            let heager = [];
            for (const v of numberLinks) {
                heager.push({
                    header: v.number,
                    title: v.number,
                    id: `${usedPrefix + command} رسائل ${v.fullLink}`,
                    description: `قائمة رسائل الرقم ${v.number}`
                });
            }

            const media = await prepareWAMessageMedia({ image: { url: pp } }, { upload: conn.waUploadToServer });

            const caption = '╮────────────────────────╭ـ\n│ *قائمة الأرقام :*\n╯────────────────────────╰ـ\n';

            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: { text: caption },
                            footer: { text: '𝐁𝐘┋❥ ιтαcнι вσт☞𝐁𝐎𝐓┋' },
                            header: {
                                hasMediaAttachment: true,
                                imageMessage: media.imageMessage,
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({
                                            title: 'قائـمة الأرقام',
                                            sections: [
                                                {
                                                    title: 'قائمة الأرقام',
                                                    highlight_label: '📱',
                                                    rows: heager
                                                }
                                            ]
                                        }),
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: `{"display_text": "الرئيسية", "id": "${usedPrefix + command}"}`
                                    }
                                ],
                                messageParamsJson: "",
                            },
                        },
                    },
                }
            }, { userJid: conn.user.jid, quoted: m });

            return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

        } catch (error) {
            console.log(error);
            return conn.sendButton(m.chat, `╮────────────────────────╭ـ\n│ حدث خطأ أثناء جلب البيانات. حاول مرة أخرى لاحقًا.\n╯────────────────────────╰ـ `, '𝐁𝐘┋ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃┋', pp, [['حاول مجددا', `${usedPrefix + command} أرقام ${additionalLink}`]], null, null, m);
        }

    } else if (feature === "رسائل") {
        if (!additionalLink) {
            return conn.sendMessage(m.chat, { text: "يرجى إدخال رابط بعد الأمر \"رسائل\"." }, { quoted: m });
        }

        try {
            let response = await fetch(additionalLink);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            let html = await response.text();
            const $ = cheerio.load(html);

            let messages = [];
            $('.direct-chat-msg.left').each((i, el) => {
                const from = $(el).find('.direct-chat-info span.pull-right').text().trim();
                const time = $(el).find('.direct-chat-timestamp').text().trim();
                const msgText = $(el).find('.direct-chat-text').text().trim(); // renamed to avoid shadowing

                messages.push({ from: from || 'مجهول', time: time || '', text: msgText || '' });
            });

            let heager = [];
            for (const v of messages) {
                heager.push({
                    header: v.from,
                    title: v.text.length > 30 ? v.text.slice(0, 30) + "…" : v.text,
                    id: `${usedPrefix + command} كود ${v.text}`,
                    description: `الوقت: ${v.time}`
                });
            }

            const media = await prepareWAMessageMedia({ image: { url: pp } }, { upload: conn.waUploadToServer });

            const caption = '╮────────────────────────╭ـ\n│ *قائمة الرسائل :*\n╯────────────────────────╰ـ\n';

            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: { text: caption },
                            footer: { text: '𝐁𝐘┋❥ ιтαcнι вσт☞𝐁𝐎𝐓┋' },
                            header: {
                                hasMediaAttachment: true,
                                imageMessage: media.imageMessage,
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({
                                            title: 'قائمة الرسائل',
                                            sections: [
                                                {
                                                    title: 'قائمة الرسائل',
                                                    highlight_label: '📧',
                                                    rows: heager
                                                }
                                            ]
                                        }),
                                    },
                                    {
                                        name: 'quick_reply',
                                        buttonParamsJson: `{"display_text": "الرئيسية", "id": "${usedPrefix + command}"}`
                                    }
                                ],
                                messageParamsJson: "",
                            },
                        },
                    },
                }
            }, { userJid: conn.user.jid, quoted: m });

            return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

        } catch (error) {
            console.log(error);
            return conn.sendButton(m.chat, `╮────────────────────────╭ـ\n│ حدث خطأ أثناء جلب البيانات. حاول مرة أخرى لاحقًا.\n╯────────────────────────╰ـ `, '𝐁𝐘┋ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃┋', pp, [['حاول مجددا', `${usedPrefix + command} رسائل ${additionalLink}`]], null, null, m);
        }

    } else if (feature === "كود") {
        if (!additionalLink) {
            return conn.sendMessage(m.chat, { text: "يرجى إدخال نص الرسالة بعد الأمر \"كود\"." }, { quoted: m });
        }

        // نعتبر كل إضافي هو الكود المطلوب (قد يحتوي على مسافات)
        let code = additionalLink;

        const caption = `╮────────────────────────╭ـ\n│ *كود التحقق :* ${code}\n╯────────────────────────╰ـ\n`;

        conn.sendButton(m.chat, caption, '𝐁𝐘┋ 𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃┋', pp, [['الرئيسية', `${usedPrefix + command}`]], null, null, m);
    }
};

handler.help = ["facknumbar"];
handler.tags = ["fack"];
handler.command = /^(رقم)$/i;
export default handler;