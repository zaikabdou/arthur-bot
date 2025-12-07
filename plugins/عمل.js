let handler = async (m, { conn, isPrems}) => {
let hasil = Math.floor(Math.random() * 5000)
let time = global.db.data.users[m.sender].lastwork + 600000
if (new Date - global.db.data.users[m.sender].lastwork < 600000) throw `*أنت متعب يجب أن تستريح على الأقل ${msToTime(time - new Date())}للعودة إلى العمل!*`
 
await delay(3 * 3000)
m.reply(`${pickRandom(global.work)} *${hasil} خبره*`)
global.db.data.users[m.sender].lastwork = new Date * 1
}
handler.help = ['work']
handler.tags = ['xp']
handler.command = ['عمل', 'trabajar']
handler.fail = null
handler.exp = 0
export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
const seconds = Math.floor((duration / 1000) % 60),
const minutes = Math.floor((duration / (1000 * 60)) % 60),
const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
const hours = (hours < 10) ? "0" + hours : hours
const minutes = (minutes < 10) ? "0" + minutes : minutes
const seconds = (seconds < 10) ? "0" + seconds : seconds

return minutes + " دقائق " + seconds + " ثواني " 
}


function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.work = ["مطور مواقع ويب", "مطور العاب", "احد مطورين بوت الـتربـو 🌚", "مساعد تنسيق في بوت الـتربـو", "مساعد مشرف علي مجموعات الـتربـو ", "مطور العاب", "عملت في منجم", "منظم حفلات من اجل الحصول علي",
 "مساعد طبيب ", "تعمل كطباخ", 
"تعمل كمهندس ", 
"تعمل كطبيب", 
"تعمل في بنك ", 
"جاء شخص ما وأقام مسرحية وانت عملت كاحد طاقميها", "قمت بشراء وبيع العناصر وكسبت", 
"تعمل في بيتزا هوت وتكسب", 
"انت تعمل ككاتب وتكسب", "تذهب من خلال حقيبتك وتقرر بيع بعض العناصر غير المفيدة التي لا تحتاج إليها. تبين أن كل هذا الهراء كان يستحق", 
"تساعد محتاج وتحصل", 
"أنت تطور الألعاب من أجل لقمة العيش وتفوز", 
"لقد ربحت مسابقة أكل الفلفل الحار. الجائزة", 
"تعمل طوال اليوم في شركه وتربح", 
"تنضم لفريق الـتربـو والفانز *ES* وتحصل علي", "لقد صممت شعار تيم الـتربـو *ES* وحصلت علي", 
"لقد قمت بالاشراف علي مجموعه *ES* عندما لم يكن موجود تفوز ب ", 
"لقد عمل بأفضل ما لديه في شركة طباعة كانت توظف وحصلت علي", 
"احد افراد تيم الـتربـو *ES*", "لقد زاد الطلب على ألعاب الأجهزة المحمولة ، لذا يمكنك إنشاء لعبة جديدة مليئة بالمعاملات الصغيرة. مع لعبتك الجديدة تكسب", 
"أنت تعمل كممثل صوتي لـسبونج بوب وتمكنت من الفوز ب ", 
"كنت تزرع وفزت ب", "تبني قلعة رملية وتربح", "لقد عملت وربحت", 
"تعمل كصانع لوجوهات لتيم الـتربـو  وتحصل علي","تعمل كبلوجر وتحصل علي", 
"تعمل علي بريمير لتعديل الفديوهات وتحصل علي"
]