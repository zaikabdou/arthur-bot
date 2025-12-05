import fetch from 'node-fetch';

const gameDuration = 60000; // مدة اللعبة
const basePoints = 500; // عدد النقاط الأساسية
const maxQuestions = 15; // عدد الأسئلة في اللعبة
const maxHelps = 2; // عدد المساعدات المتاحة على مستوى اللعبة بالكامل
const maxHints = 1; // عدد التلميحات المتاحة
const maxResponses = 1; // عدد مساعدات الجمهور المتاحة
const maxReducedOptions = 1; // عدد مساعدات إزالة الخيارات المتاحة

const difficultyLevels = {
    easy: 1,
    medium: 2,
    hard: 3
}; // نظام مستويات الصعوبة

export async function handler(m, { command, text, conn }) {
    let id = m.chat;

    conn.millionGame = conn.millionGame || {};

    let currentGame = conn.millionGame[id];

    // تحميل الأسئلة من Gist
    let src = await (await fetch('https://gist.githubusercontent.com/Dx-Tea/19102ea14b19d7ef685128e6186a277d/raw/867b4da16f68253f67ca184f77ce5295d1da4029/By-shanks')).json();

    if (!src || src.length === 0) {
        return conn.reply(m.chat, '> *⚠️ لا توجد أسئلة متاحة في الوقت الحالي.*', m);
    }

    let shanks = 'https://qu.ax/Cnbf.jpg';
    let selectedDifficulty = 'medium'; // مثال: يمكنك تغيير هذا بناءً على اختيار اللاعب

    if (currentGame) {
        if (!text) {
            return conn.reply(m.chat, `> *❕ هناك لعبة قيد التشغيل. المستوى الحالي: ${currentGame[4]}, المساعدات المتبقية: ${currentGame[5]}*`, m);
        } else if (text === currentGame[1].response) {
            m.react('✅');
            let currentLevel = currentGame[4];
            let points = basePoints * currentLevel;

            // نظام مكافأة السرعة
            let timeTaken = gameDuration - (Date.now() - currentGame[2].startTime);
            let speedBonus = Math.max(0, Math.floor((timeTaken / 1000) * 50)); // مكافأة السرعة
            let totalPoints = points + speedBonus;

            global.db.data.users[m.sender].exp += totalPoints;

            conn.sendButton(m.chat, `> *🎊 مبروك! لقد ربحت ${totalPoints} نقطة (بما في ذلك ${speedBonus} مكافأة السرعة)! المستوى الحالي: ${currentLevel}*`, null, null, [[`↬ السؤال التالي`, `.المليون`]], null, null);

            // التأكد من مستوى التقدم
            if (currentLevel === 5 || currentLevel === 10) {
                conn.reply(m.chat, `> 🎉 مبروك! لقد وصلت إلى المستوى ${currentLevel} وحصلت على مكافأة إضافية!`, m);
                global.db.data.users[m.sender].exp += 1000; // إضافة مكافأة 1000 نقطة
            }

            clearTimeout(currentGame[3]);
            currentLevel++;

            if (currentLevel > maxQuestions) {
                conn.reply(m.chat, '> *🎉 مبروك! لقد ربحت المليون!*', m);
                delete conn.millionGame[id];
            } else {
                startNewQuestion(conn, m, id, currentLevel, src);
            }

        } else if (text === 'قائمة المساعدات' && currentGame[5] > 0) {
            m.react('💡');
            
            let message = `
> *🆘 قائمة المساعدات المتاحة:*
*⓵ المساعدات المتبقية* 
*${currentGame[5]}*
*⓶ التلميحات المتبقية* 
*${currentGame[6]}*
*⓷ اجوابة الجمهور المتوفرة*
*${currentGame[7]}*
*⓸ ازالة اختيارين المتوفرة*
*${currentGame[8]}*
            `;

            await conn.sendButton(m.chat, message, null, shanks, [
                [`مساعدة 💡`, `.المليون مساعدة`],
                [`تلميح 💡`, `.المليون تلميح`],
                [`مساعدة الجمهور 🎥`, `.المليون جواب`],
                [`انسحاب 🏃‍♂️`, `.المليون انسحب`],
                [`قم بازالة اختيارين`, `.المليون إزالة اختيارين`]
            ], null, null);
        } else if (text === 'مساعدة' && currentGame[5] > 0) {
            m.react('💡');
            let help = getHalfAnswer(currentGame[1].response);
            conn.reply(m.chat, `> *💡 التلميح: نصف الإجابة الصحيحة هو: ${help}*`, m);
            currentGame[5]--;

        } else if (text === 'إزالة اختيارين' && currentGame[8] > 0) {
            m.react('💡');
            
            let reducedOptions = removeTwoIncorrectOptions(currentGame[1].response, currentGame[1].options);
            
            // إرسال الخيارات المتبقية فقط
            conn.sendButton(m.chat, `> *💡 تمت إزالة خيارين. الخيارات المتبقية هي: ${reducedOptions.join(' أو ')}*`, null, shanks, [
                [`${reducedOptions[0]}`, `.المليون ${reducedOptions[0]}`],
                [`${reducedOptions[1]}`, `.المليون ${reducedOptions[1]}`]
            ], null, null);
            
            currentGame[8]--; // تقليل عدد المساعدات المتبقية
        } else if (text === 'إزالة اختيارين' && currentGame[8] <= 0) {
            conn.reply(m.chat, '> *⚠️ لقد استخدمت جميع مساعدات إزالة الاختيارين المتاحة.*', m);

        } else if (text === 'تلميح' && currentGame[6] > 0) {
            m.react('💡');
            let hint = getHint(currentGame[1].hint);
            conn.reply(m.chat, `> *💡 التلميح: ${hint}*`, m);
            currentGame[6]--;

        } else if (text === 'تلميح' && currentGame[6] <= 0) {
            conn.reply(m.chat, '> *⚠️ لقد استخدمت جميع التلميحات المتاحة.*', m);

        } else if (text === 'جواب' && currentGame[7] > 0) {
            m.react('💡');
            let response = getAudienceHelp(currentGame[1].response);
            conn.reply(m.chat, `> *💡 الجمهور يعتقد أن الإجابة الصحيحة هي: ${response}*`, m);
            currentGame[7]--;

        } else if (text === 'جواب' && currentGame[7] <= 0) {
            conn.reply(m.chat, '> *⚠️ لقد استخدمت جميع مساعدات الجمهور المتاحة.*', m);

        } else if (text === 'انسحب') {
            clearTimeout(currentGame[3]);
            conn.sendButton(m.chat, `> *تم الانسحاب بنجاح. الإجابة الصحيحة كانت: ${currentGame[1].response}*`, null, null, [[`↬ لعبة جديدة`, `.المليون`]], null, null);
            delete conn.millionGame[id];

      } else if (text === 'الصدارة' && currentGame[5] > 0) {
            m.react('💡');
            
            let message = `
> *🆘 قائمة الصدارة المتاحة:*
${index + 1}. ${user.name || 'مجهول'} - ${user.exp} نقاط`;

            await conn.sendButton(m.chat, message, null, shanks, [
                [`مساعدة 💡`, `.المليون مساعدة`],
                [`تلميح 💡`, `.المليون تلميح`],
                [`مساعدة الجمهور 🎥`, `.المليون جواب`],
                [`انسحاب 🏃‍♂️`, `.المليون انسحب`],
                [`قم بازالة اختيارين`, `.المليون إزالة اختيارين`]
            ], null, null);

        } else {
            clearTimeout(currentGame[3]);
            m.react('❌');
            conn.sendButton(m.chat, `> *❌ الإجابة خاطئة. الإجابة الصحيحة كانت: ${currentGame[1].response}*`, null, null, [[`↬ لعبة جديدة`, `.المليون`]], null, null);
            delete conn.millionGame[id];
        }

    } else {
        if (!text) {
            let currentLevel = 1;
            startNewQuestion(conn, m, id, currentLevel, src);
        } else {
            m.react('👇🏻');
            conn.sendButton(m.chat, `> *لعبة جديدة قد بدأت.*`, null, null, [[`↬ السؤال`, `.المليون`]], null, null);
        }
    }
}

// دالة بدء السؤال الجديد
async function startNewQuestion(conn, m, id, level, src) {
    let question = src[Math.floor(Math.random() * src.length)];
    
    // إذا كان هناك سؤال مفاجئ، اختياره
    if (Math.random() < 0.1) { // مثال: 10% احتمال الحصول على سؤال مفاجئ
        question = await getSurpriseQuestion(src);
    }

    let options = [...question.options];
    while (options.length < 4) {
        let randomOption = src[Math.floor(Math.random() * src.length)].response;
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }

    options = options.sort(() => Math.random() - 0.5);

    let remainingHelps = conn.millionGame[id] ? conn.millionGame[id][5] : maxHelps;
    let remainingHints = conn.millionGame[id] ? conn.millionGame[id][6] : maxHints;
    let remainingResponses = conn.millionGame[id] ? conn.millionGame[id][7] : maxResponses;
    let remainingReducedOptions = conn.millionGame[id] ? conn.millionGame[id][8] : maxReducedOptions;

    conn.millionGame[id] = [m, question, { startTime: Date.now() }, setTimeout(() => {
        delete conn.millionGame[id];
        conn.sendButton(m.chat, `> *⏰ انتهى وقت اللعبة. الإجابة كانت: ${question.response}*`, null, null, [[`↬ لعبة جديدة`, `.المليون`]], null, null);
    }, gameDuration), level, remainingHelps, remainingHints, remainingResponses, remainingReducedOptions];

    let message = `
> *احزر الإجابة الصحيحة:*
> *السؤال: ${question.question}*
> *وقت الإجابة: ${(gameDuration / 1000).toFixed(2)} ثواني*
> *الجائزة: ${basePoints * level} نقطة*
> *للانـسـحـاب اضغط على زر انسحب*
> *يمكنك طلب مساعدة مرة واحدة لكل مستوى باستخدام زر مساعدة*
`;

    let shanks1 = 'https://qu.ax/Cnbf.jpg';

    await conn.sendButton(m.chat, message, '> ◜𝙰𝚁𝚃𝙷𝚄𝚁_𝙱𝙾𝚃🌋', shanks1, [
        [`①: ${options[0]}`, `.المليون ${options[0]}`],
        [`②: ${options[1]}`, `.المليون ${options[1]}`],
        [`③: ${options[2]}`, `.المليون ${options[2]}`],
        [`④: ${options[3]}`, `.المليون ${options[3]}`],
        [`قائمة المساعدات🌋`, `.المليون قائمة المساعدات`]
    ], null, null);
}

// دالة الحصول على السؤال المفاجئ
async function getSurpriseQuestion(src) {
    // يمكنك استبدال هذا الرابط برابط Gist أو API خاص بأسئلة مفاجئة
    let surpriseSrc = await (await fetch('https://gist.githubusercontent.com/Dx-Tea/19102ea14b19d7ef685128e6186a277d/raw/867b4da16f68253f67ca184f77ce5295d1da4029/Surprise-Questions')).json();
    return surpriseSrc[Math.floor(Math.random() * surpriseSrc.length)];
}

// دالة للحصول على التلميح
function getHint(hint) {
    return hint ? hint : 'لا يوجد تلميح متاح لهذا السؤال.';
}

// دالة للحصول على إجابة الجمهور
function getAudienceHelp(response) {
    return response ? response : 'لا توجد إجابة متاحة من الجمهور.';
}

// دالة للحصول على نصف الإجابة
function getHalfAnswer(answer) {
    let halfLength = Math.ceil(answer.length / 2);
    return answer.substring(0, halfLength) + "...";
}

// دالة لإزالة خيارين غير صحيحين
function removeTwoIncorrectOptions(correctAnswer, options) {
    // تصفية الخيارات لإبقاء الخيارات غير الصحيحة فقط
    let incorrectOptions = options.filter(option => option !== correctAnswer);

    // خلط الخيارات غير الصحيحة واختيار اثنين منها للإزالة
    incorrectOptions = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2);

    // إنشاء قائمة جديدة تحتوي على الإجابة الصحيحة والخيارين الآخرين المتبقيين
    let newOptions = options.filter(option => !incorrectOptions.includes(option));

    return newOptions;
}

// دالة للحصول على لائحة الصدارة
async function getLeaderboard(conn) {
    let users = Object.values(global.db.data.users);
    users.sort((a, b) => b.exp - a.exp);
    let leaderboard = users.slice(0, 10).map((user, index) => {
        return `${index + 1}. ${user.name || 'مجهول'} - ${user.exp} نقاط`;
    }).join('\n');

    return leaderboard || 'لا توجد بيانات لائحة الصدارة.';
}

handler.help = ['المليون'];
handler.tags = ['العاب'];
handler.command = /^المليون$/i;

export default handler;
