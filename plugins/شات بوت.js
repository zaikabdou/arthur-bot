let handler = m => m;

handler.all = async function (m) {
  if (m.key.fromMe) return; // منع البوت من الرد على نفسه

  let chat = global.db.data.chats[m.chat];

  if (chat.isBanned) return;

  let fake = {
    key: {
      fromMe: false,
      participant: '𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃@s.whatsapp.net',
      remoteJid: '120363384250924818@g.us',
    },
    message: {
      conversation: '｢🩸┊𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃┊⚡｣'
    },
    participant: '0@s.whatsapp.net',
  };

  // **الردود المسجلة**
  if (/^احا$/i.test(m.text)) { 
    conn.reply(m.chat, `*خدها و شلحها😆*`, fake);
  }

  if (/^دزمها$/i.test(m.text)) { 
    conn.reply(m.chat, `*ما تدز امها انت اول بعدها تقولها*`, fake);
  }

  if (/^الحمدلله$/i.test(m.text)) { 
    conn.reply(m.chat, `*ادام الله حمدك*`, fake);
  }

  if (/^حمار|يا غبي|اهبل|غبي$/i.test(m.text)) { 
    conn.reply(m.chat, `*َمفيش اغـبـى منك فـي الـعالـم🥷ٌٍََََََُِّْ*`, fake);
  }

  if (/^بوت$/i.test(m.text)) { 
    conn.reply(m.chat, `*انا مـوجـود 🥷*`, fake);
  }

  if (/^يب$/i.test(m.text)) { 
    conn.reply(m.chat, `*استرجل وقول نعم شو يب هاي 🐦‍⬛*`, fake);
  }

  if (/^ارثر$/i.test(m.text)) { 
    conn.reply(m.chat, `*مطوري و معلمي😊*`, fake);
  }

  if (/^بوت خرا|بوت زفت|خرا عليك$/i.test(m.text)) { 
    conn.reply(m.chat, `*لم نفسك قبل ما انسي اني بوت  و امسح بيك ارض الشات😒🗿*`, fake);
  }

  if (/^منور|منوره$/i.test(m.text)) { 
    conn.reply(m.chat, `*بنوري انا 🫠💔*`, fake);
  }

  if (/^بنورك|دا نورك|نورك الاصل|نور نورك$/i.test(m.text)) { 
    conn.reply(m.chat, `*بنوري انا 🫠🐦*`, fake);
  }

  if (/^امزح|بهزر$/i.test(m.text)) { 
    conn.reply(m.chat, `*دمك تقيل متهزرش تاني😒*`, fake);
  }

  if (/^في اي|في ايه$/i.test(m.text)) { 
    conn.reply(m.chat, `*انا معرفش حاجه🙂*`, fake);
  }

  if (/^تست$/i.test(m.text)) { 
    conn.reply(m.chat, `*𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃 فـي الـخدمه 🥷🌹*`, fake);
  }

  if (/^شو تعمل|شو تسوي$/i.test(m.text)) { 
    conn.reply(m.chat, `*انت مالك😒*`, fake);
  }

  if (/^انا جيت$/i.test(m.text)) { 
    conn.reply(m.chat, `*امشي تاني*`, fake);
  }

  if (/^حرامي|سارق$/i.test(m.text)) { 
    conn.reply(m.chat, `*تتهم بريء بالسرقة من دون تحري او بحث عن حقيقة ليست ملموسة ارحنا واعمل شرطي ثم افتح فمك وثرثر فكلامك كـجاهل واحد بل جهلاً ارحم من حديثك تتصنع دور الشرطي وكأنك محقق بالله اصمت ولا تحرج نفسك ارحنا وارح أعصابك ان اكرمك الله بعقل فبسكوتك اقتل جهلك*`, fake);
  }

  if (/^ملل|مللل|ملللل|زهق$/i.test(m.text)) { 
    conn.reply(m.chat, `*لانك موجود🗿*`, fake);
  }

  if (/^🤖$/i.test(m.text)) { 
    conn.reply(m.chat, `انت بوت عشان ترسل الملصق ده 🐦`, fake);
  }

  if (/^🐦‍⬛$/i.test(m.text)) { 
    conn.reply(m.chat, `🐦`, fake);
  }

  if (/^ايوا$/i.test(m.text)) { 
    conn.reply(m.chat, `*بلاش ارد احسن🌝🤣*`, fake);
  }

  if (/^نعم$/i.test(m.text)) { 
    conn.reply(m.chat, `*حد ناداك 🌚🐦*`, fake);
  }

  if (/^كيفك|شخبارك|علوك|عامل ايه|اخبارك|اي الدنيا$/i.test(m.text)) { 
    conn.reply(m.chat, `*ملكش فيه🗿*`, fake);
  }

  if (/^🐤$/i.test(m.text)) { 
    conn.reply(m.chat, `🐦`, fake);
  }
  
  if (/^تصبح علي خير|تصبحوا علي خير$/i.test(m.text)) { 
    conn.reply(m.chat, `وانت من اهل الخير حبيبي✨💜`, fake);
  }
  
  if (/^ببحبك بوت|حبك|بوت بحبك$/i.test(m.text)) { 
    conn.reply(m.chat, `*اسكت بدل ما انادي ساكو يتحرش بيك*`, fake);
  }
   
  if (/^🙂$/i.test(m.text)) { 
    conn.reply(m.chat, `بص بعيد🙂`, fake);
  }
  
  if (/^بروح|سلام|باي$/i.test(m.text)) { 
    conn.reply(m.chat, `*انقلع مين يطيقك 🗿*`, fake);
  }
   
  if (/^هلا$/i.test(m.text)) { 
    conn.reply(m.chat, `*اهلـيـن كـيـف حـالـك 🐤🌹*`, fake);
  }

if (/^🦦$/i.test(m.text)) { 
    conn.reply(m.chat, `🐧`, fake);
  }
  if (/يا خرا|دانت خرا|خرا عليك$/i.test(m.text)) { 
    conn.reply(m.chat, `*يعم لما يبقا عندك  رجولة الاول تعالا اتكلم😂*`, fake);
  }
  return !0;
}

export default handler;