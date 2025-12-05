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
   if (/^دييم$/i.test(m.text)) { 
     responses = [ 
 '*بعرف شايف 🙂‍↔️*'  
     ]; 
}else if (/^ولاشي|ولا شي$/i.test(m.text)) { 
     responses = [ 
'*طول الوقت هيك انت 🙂*',
'*ما بدك تسولف اطلع براحتك😖*'
     ]; 
}else if (/^وتفف|وتف$/i.test(m.text)) { 
     responses = [ 
'*شبك يمز😘*',
     ]; 
}else if (/^يلعن$/i.test(m.text)) { 
     responses = [ 
'*احيهه🗿*',
'*الـلـه يـسـامـحـك 🙂*',
'*ليش تلعن طيب😭*',
     ]; 
     }else if (/^اهاا|اماا|افاا|ماااا|افااا|اهااا$/i.test(m.text)) { 
     responses = [ 
'*ليش تسلك 🌚🙂*'
     ]; 
} else if (/^وربي حلو|حلو وربي|حلوو حبيت|و ربي حلو$/i.test(m.text)) { 
     responses = [ 
       '*♥🐥وعليكم السلام*',  
     ]; 
     }else if (/^ميكاسا$/i.test(m.text)) { 
     responses = [ 
'*قصدك الي تقدح 🥰*',
     ]; 
     }else if (/^البوت ميت$/i.test(m.text)) { 
     responses = [ 
'*انت الميت🫵🏻*',
     ]; 
     }else if (/^يا ويلي$/i.test(m.text)) { 
     responses = [ 
'*بعدين شو😐*',
     ]; 
     }else if (/^عمو$/i.test(m.text)) { 
     responses = [ 
'*لساتو صغير ترا🫠*',
     ]; 
   }else if (/^اتفق|اتفقق $/i.test(m.text)) { 
     responses = [ 
'*اطلقق 🩵*',
     ]; 
     }else if (/^ايرزا|ايزرا|نورهان$/i.test(m.text)) { 
     responses = [ 
'*عيونها بس شبدك منها🙂‍↔️*',
     ]; 
     }else if (/^ليمون|ليموون|استبرق$/i.test(m.text)) { 
     responses = [ 
'*ليش تدور عليها 😉*',
     ]; 
     }else if (/^مياو|ميااو|مياااو$/i.test(m.text)) { 
     responses = [ 
'* قطة النقابة😍🫵🏻*',
     ]; 
     }else if (/^شايف|شفت|شوف$/i.test(m.text)) { 
     responses = [ 
'*شفت شو بسوي يعني🌚✨*',
     ]; 
 }else if (/^حقين نقابات$/i.test(m.text)) { 
     responses = [ 
'*مفيش غيرك*',
     ]; 
 }else if (/^قول مي*او|قول ميا*و|قول مياو$/i.test(m.text)) { 
     responses = [ 
'*ما اتشبه بالقطط*',
      '*اهلك قالو اني قط*', 
      '*جرب قولها انت اول*', 
     ]; 
 }else if (/^شو$/i.test(m.text)) { 
     responses = [ 
'*ابعث مياو خاص 😖*',
     ]; 
 }else if (/^بعترف|بعترف لها$/i.test(m.text)) { 
     responses = [ 
'*مين قال بيقبلو بيك😩❤‍🔥*',
     ]; 
   }else if (/^تعترف$/i.test(m.text)) { 
     responses = [ 
'*اوووف امتى تتزوج 😂😁*',
   ]; 
   }else if (/^قادح|مسوي قادح$/i.test(m.text)) { 
     responses = [ 
'*تعليم ارثر🗿*',
'*بتمزح صح🙂💔*',
'*ما ادري كيف تراه كيوت 🙃💔*',
]; 
   }else if (/^دز$/i.test(m.text)) { 
     responses = [ 
'*😔☝️*',
'*ما تروح على شغلك احسن*',
'*راقب تحت🙄*',   ]; 

     }else if (/^نورك$/i.test(m.text)) { 
     responses = [ 
       '*انت الاساس🌚♥*',  
     ]; 
   }else if (/^متت|متتت|متتتت|متتتتت$/i.test(m.text)) { 
     responses = [ 
'*بتكذب😔☝️*',
'*ليش تسلك🥺*',
     ]; 
   } else if (/^😖|😖😖|😖😖😖|😖😖😖😖$/i.test(m.text)) { 
     responses = [ 
'*ميكاسا الاصل🌚✨*',
      '*ميكاسا كور🙂*',
      '*تعليم ميكاسا*',
'*ميكا 5 فريم✨*',
     ]; 
     }else if (/^💋|🫦|💋💋$/i.test(m.text)) { 
     responses = [ 
       '*فديت البوسه💋*',  

     ];
     }else if (/^عبدو$/i.test(m.text)) { 
     responses = [ 
       'ارثر الاصل',  

     ];
     }else if (/^انيا|هاجر|انياا$/i.test(m.text)) { 
     responses = [ 
       '*شبدك منها 🥱*',  

     ];
     }else if (/^ساكو$/i.test(m.text)) { 
     responses = [ 
       '*المز حقي 🫦*',  

     ];
     }else if (/^مدري|ما اعرف|مش فاهم$/ .test(m.text)) { 
     responses = [ 
       '*عبيد اخر زمن*',  
     ];
       }else if (/^مز|مزه$/i.test(m.text)) { 
     responses = [ 
      '*ساكو اكثر 🫦*',
'*تعليم ساكو*', 
     ];
            }else if (/^انطم$/i.test(m.text)) { 
     responses = [ 
       '*انـت مـيـن عـشـان تـسـكـتـنـي😠*',
      '*مـش هـسـكـت😝*',
      '*اسـكـت انـت🙄*',
     ];
   }

   // === ردود إضافية مضافة بنفس الصيغة كما طلبت ===
   else if (/^شو$/i.test(m.text)) {
     responses = [
       '*اضربو على وش😂و*',
       '*ما لازم تعرف🌚*'
     ];
   } else if (/^فديت$|^فديتك$/i.test(m.text)) {
     responses = [
       '*افداك*',
       '*فداك الكون يا محوره🥺!*'
     ];
   } else if (/^😂😂$|^😂$|^😂😂😂$|^😂😂😂😂ًا$/i.test(m.text)) {
     responses = [
       '*دووم لك يارب*',
       '*دوم الضحكة على وجهك*'
     ];
   } else if (/^ياويلي$|^اويلي$/i.test(m.text)) {
     responses = [
       '*اعجبك صح 😉*',
       '*تعرف تختار 😉*'
     ];
   } else if (/^ياخي$|^اووف$|^اوف$/i.test(m.text)) {
     responses = [
       '*شو بدك تدلل*',
       '*حاضر قلّي وانا معاك*'
     ];
   } else if (/^دوم$|^دوووم$/i.test(m.text)) {
     responses = [
       '*🙏بدوامك*',
       '*نبضك 🍧*'
     ];
   } else if (/^باكل$|^بروح اكل$/i.test(m.text)) {
     responses = [
       '*صحة وهنا*',
       '*صحة على قلبك*'
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