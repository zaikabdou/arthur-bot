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
}else if (/^دييم|دييييم$/i.test(m.text)) { 
     responses = [ 
'*تعليم عمك طبعا 🙂‍↔️*',
'*طلعت بعرف انا🙂‍↔️*'
     ]; 
}else if (/^عبد|يا عبد$/i.test(m.text)) { 
     responses = [ 
'*انا عبد لله 🐤*',
     ]; 
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
'*طيب ورينا شغلك 🐤😉*',
     ]; 
     }else if (/^سونغ|ايانو|اكاي$/i.test(m.text)) { 
     responses = [ 
'*اي حب شو تدور منه خير ان شاء الله 🙏🩵*',
     ];  
   }else if (/^بخير|بخير الحمد لله $/i.test(m.text)) { 
     responses = [ 
'*دايما يارب 💎🩵*',
     ]; 
     }else if (/^روحي|حبي|حياتي$/i.test(m.text)) { 
     responses = [ 
'*عيوني انت 🥹🐤*',
     ]; 
     }else if (/^بعشقك|بعشقكك|بعشقككك$/i.test(m.text)) { 
     responses = [ 
'*بـمـوت فـيـك😍🫵🏻*',
     ]; 
     }else if (/^قلبي|يقلبي|يقلبيي$/i.test(m.text)) { 
     responses = [ 
'*فديتو قلبك😺🫶*',
     ]; 
 }else if (/^بوت علق$/i.test(m.text)) { 
     responses = [ 
'*مفيش علق غيرك*',
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
'*بيك طبعا 😣*',
   ]; 
   }else if (/^تحبني|احبك$/i.test(m.text)) { 
     responses = [ 
'*اموت فيك 🌚💔*',
'*اكرهك🙂💔*',
'*احبك نص حب 🙃💔*',
]; 

     }else if (/^هاي$/i.test(m.text)) { 
     responses = [ 
       '*هالو🌚♥*',  
     ]; 
   }else if (/^بموتفيك|بموت فيك|بموت فيكك|بموت فيككك$/i.test(m.text)) { 
     responses = [ 
'*بـدمـنـكككك💋*',
'*بـعـشـقـكككك🥺*',
     ]; 

     }else if (/^🌚|😉|🥹$/i.test(m.text)) { 
     responses = [ 
       '😘',  

     ];
 
     }else if (/^انت عسل|انت عسلل|انت عسللل$/ .test(m.text)) { 
     responses = [ 
       '*وانتي قمر🦦🫶🏻*',  
     ];
       }else if (/^خرا|كول خرا$/i.test(m.text)) { 
     responses = [ 
      '*نعم الاخلاق*',
'*تسلم عراسي*', 
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
   } else if (/^تمام$|^يتم$|^تمامًا$/i.test(m.text)) {
     responses = [
       '*افراحك 🖤*',
       '*سعادتك 🤍*'
     ];
   } else if (/^خلاص$|^خلص$/i.test(m.text)) {
     responses = [
       '*لا ليش خلاص🐤*',
       '*افكر واشوف🤔!*'
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