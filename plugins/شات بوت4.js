import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m;
handler.all = async function (m) {
    // التحقق مما إذا كانت الرسالة مرسلة من البوت نفسه
    if (m.key.fromMe) {
        return; // إيقاف التنفيذ إذا كانت الرسالة مرسلة من البوت
    }

    let chat = global.db.data.chats[m.chat];
    let responses;
   if (/^اهينك$/i.test(m.text)) { 
     responses = [ 
 '*مفيش مهان غيرك*'  
     ]; 
}else if (/^ديم|دييييم$/i.test(m.text)) { 
     responses = [ 
'*تعليم عمك طبعا 🙂‍↔️*',
'*طلعت بعرف انا🙂‍↔️*'
     ]; 
}else if (/^عبد|يا عبد$/i.test(m.text)) { 
     responses = [ 
'*مسوي قادح😘*',
     ]; 
}else if (/^امك$/i.test(m.text)) { 
     responses = [ 
'*😍*',
'*الـلـه يـسـامـحـك 🙂*',
'*ليش كذا 🙂*',
     ]; 
     }else if (/^اوكك|اوككك|اوكي|اوكيي|اوكييي$/i.test(m.text)) { 
     responses = [ 
'*تمام 🙂🌚*'
     ]; 
} else if (/^السلام عليكم|سلام عليكم ورحمه الله وبركاته|سلام عليكم|السلام عليكم ورحمه الله وبركاته$/i.test(m.text)) { 
     responses = [ 
       '*♥🐥وعليكم السلام*',  
     ]; 
     }else if (/^نورت$/i.test(m.text)) { 
     responses = [ 
'*نورك عاكس حب*',
     ]; 
     }else if (/^بوت عاق|عاق|بوت عبد|عبدي|العاق$/i.test(m.text)) { 
     responses = [ 
'*انت العاق والعبد 🫵🏻*',
     ]; 
     }else if (/^سوبارو|شوكو|سونغ|ايانو|اكاي$/i.test(m.text)) { 
     responses = [ 
'*اي حب شو تدور منه خير ان شاء الله 🙏🩵*',
     ]; 
     }else if (/^مو انت$/i.test(m.text)) { 
     responses = [ 
'*رافض تعترف بعمك 🙌*',
     ]; 
   }else if (/^بخير|بخير الحمد لله $/i.test(m.text)) { 
     responses = [ 
'*دايما يارب 💎🩵*',
     ]; 
     }else if (/^كسم البوت|كسم بوت|كسمك يابوت$/i.test(m.text)) { 
     responses = [ 
'*كسمين امك يخول متشتمش البوت يعرص🫵🏻*',
     ]; 
     }else if (/^روحي|حبي|حياتي$/i.test(m.text)) { 
     responses = [ 
'*قلبو 💋❤️*',
     ]; 
     }else if (/^بعشقك|بعشقكك|بعشقككك$/i.test(m.text)) { 
     responses = [ 
'*بـمـوت فـيـك😍🫵🏻*',
     ]; 
     }else if (/^قلبي|يقلبي|يقلبيي$/i.test(m.text)) { 
     responses = [ 
'*قلب قلبك🌚✨*',
     ]; 
 }else if (/^بوت علق$/i.test(m.text)) { 
     responses = [ 
'*مفيش علق غيرك*',
     ]; 
 }else if (/^🗿|🗿🗿|🗿🗿🗿$/i.test(m.text)) { 
     responses = [ 
'*مسوي بارد يا ولد*',
      '*دزمها*', 
      '*قول مياو*', 
     ]; 
 }else if (/^بوت عاق$/i.test(m.text)) { 
     responses = [ 
'*انت العاق*',
     ]; 
 }else if (/^كداب|شرير$/i.test(m.text)) { 
     responses = [ 
'*مظلوم اككيد😩❤‍🔥*',
     ]; 
   }else if (/^مرتبط$/i.test(m.text)) { 
     responses = [ 
'*هتشقطينى يبت 😂😁*',
   ]; 
   }else if (/^بوت بتحبني؟|بوت بتحبنى$/i.test(m.text)) { 
     responses = [ 
'*اموت فيك 🌚💔*',
'*اكرهك🙂💔*',
'*احبك نص حب 🙃💔*',
]; 
   }else if (/^بوت بتكرهني؟$/i.test(m.text)) { 
     responses = [ 
'*ماعاش من يكرهكك حبي 🙁*',
'*لا بس لا تتعب نفسك لحبك🫥*',
'*ااه اكرهك🙄*',   ]; 

     }else if (/^هاي$/i.test(m.text)) { 
     responses = [ 
       '*هالو🌚♥*',  
     ]; 
   }else if (/^بموتفيك|بموت فيك|بموت فيكك|بموت فيككك$/i.test(m.text)) { 
     responses = [ 
'*بـدمـنـكككك💋*',
'*بـعـشـقـكككك🥺*',
     ]; 
   } else if (/^عيب|عيبب|يا عيب شوم|عيبببب$/i.test(m.text)) { 
     responses = [ 
'*بـرحـتـي🌚✨*',
      '*مـفـيـش عـيـب بـيـنـا🙃*',
      '*الـعـيـب فـالـجـيـب*',
'*مـيـخـصـكـش✨*',
     ]; 
     }else if (/^🌚|😉|🥹$/i.test(m.text)) { 
     responses = [ 
       '😘',  

     ];
     }else if (/^تحبني$/i.test(m.text)) { 
     responses = [ 
       '🌚♥اكيد',  

     ];
     }else if (/^بتحبني|بتحبني؟|بتحبنيي$/i.test(m.text)) { 
     responses = [ 
       '*بـعـشقـككك💋✨*',  

     ];
     }else if (/^اسمع$/i.test(m.text)) { 
     responses = [ 
       '*لساتك صغير*',  

     ];
     }else if (/^انت عسل|انت عسلل|انت عسللل$/ .test(m.text)) { 
     responses = [ 
       '*وانتي قمر🦦🫶🏻*',  
     ];
       }else if (/^خرا|كول خرا$/i.test(m.text)) { 
     responses = [ 
      '*كله انت*',
'*انت الي خرا*', 
     ];
            }else if (/^اسكت$/i.test(m.text)) { 
     responses = [ 
       '*انـت مـيـن عـشـان تـسـكـتـنـي😠*',
      '*مـش هـسـكـت😝*',
      '*اسـكـت انـت🙄*',
     ];
   }

   // === ردود إضافية مضافة بنفس الصيغة كما طلبت ===
   else if (/^وينك$/i.test(m.text)) {
     responses = [
       '*هنا وياك يابطل!*',
       '*ماشي في الخدمة🌚*'
     ];
   } else if (/^حلو$|^حلوو$/i.test(m.text)) {
     responses = [
       '*واو حلو كتير💎*',
       '*يعطيك العافية على الذوق!*'
     ];
   } else if (/^تمام$|^تمامن$|^تمامًا$/i.test(m.text)) {
     responses = [
       '*تمام يابطل👌*',
       '*تمام وتمام✌️*'
     ];
   } else if (/^خلاص$|^خلص$/i.test(m.text)) {
     responses = [
       '*طيب خلاص😂*',
       '*على راحتك!*'
     ];
   } else if (/^شكو$|^شو فيه$|^شو بصير$/i.test(m.text)) {
     responses = [
       '*قولي يا جميل ايش في؟*',
       '*حاضر قلّي وانا معاك*'
     ];
   } else if (/^صباح الخير$|^صباحو$/i.test(m.text)) {
     responses = [
       '*صباح النور والحب♥*',
       '*صباحك فل وياسمين🌼*'
     ];
   } else if (/^تصبح على خير$|^تصبحى على خير$/i.test(m.text)) {
     responses = [
       '*وتحلم بأحلى حاجه🌙*',
       '*تصبح على خير يا غالي*'
     ];
   }
   // === نهاية الردود الإضافية ===

   if (responses) { 
     let randomIndex = Math.floor(Math.random() * responses.length); 
     conn.reply(m.chat, responses[randomIndex], m); 
   } 
   return !0 
 }; 

 export default handler;