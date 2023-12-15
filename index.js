require('dotenv').config();
const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } = require('grammy');
const { getRandomQuestion, getCorrectAnswer } = require('./utils');

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard()
    .text('Web')
    .text('Web-Api')
    .row()
    .text('ООП и ФП')
    .text('HTML')
    .row()
    .text('CSS')
    .text('JavaScript')
    .row()
    .text('JS in Browser')
    .text('Async JS')
    .row()
    .text('ECMAScript')
    .text('Accessibility')
    .row()
    .text('TypeScript')
    .text('React')
    .row()
    .text('State Management')
    .text('Node.js')
    .row()
    .text('Testing')
    .text('Tools')
    .row()
    .text('SoftSkills')
    .resized();
    await ctx.reply('Привет! Я - FrontendQuestionsBot. \nЯ помогу тебе подготовиться к интервью \nна должность "Frontend-разработчик"!');
    await ctx.reply('Выбери тему вопроса в меню ниже', {
        reply_markup: startKeyboard
    });
});


bot.hears(['Web', 'Web-Api', 'ООП и ФП', 'HTML', 'CSS', 'JavaScript',
    'JS in Browser', 'Async JS', 'ECMAScript', 'Accessibility', 'TypeScript',
    'React', 'State Management', 'Node.js', 'Testing', 'Tools', 'SoftSkills'], async (ctx) => {
    const topic = ctx.message.text.toLowerCase();
    const { question, questionTopic } = getRandomQuestion(topic);

    let inlineKeyboard;

    if(question.hasOption) {
        const buttonRows = question.options.map((option) => {
            return [InlineKeyboard.text(option.text, JSON.stringify({
                type: `${questionTopic}-option`,
                isCorrect: option.isCorrect,
                questionID: question.id
            }))];
        });
        inlineKeyboard = InlineKeyboard.from(buttonRows);
    } else {
        inlineKeyboard = new InlineKeyboard().text('Забрать ответ', 
            JSON.stringify({
                type: questionTopic,
                questionID: question.id
            })
        );
    }

    await ctx.reply(question.text, {
        reply_markup: inlineKeyboard
    });
});

bot.on('callback_query:data', async (ctx) => {
    const callbackData = JSON.parse(ctx.callbackQuery.data);
    if (!callbackData.type.includes('option')) {
        const answer = getCorrectAnswer(callbackData.type, callbackData.questionID);
        await ctx.reply(answer, { 
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
        await ctx.answerCallbackQuery();
        return;
    }
    if (callbackData.isCorrect) {
        await ctx.reply('Верно ✅');
        await ctx.answerCallbackQuery();
        return;
    }
    const answer = getCorrectAnswer(callbackData.type.split('-')[0], callbackData.questionID);
    await ctx.reply(`Неверно ❌ Правильный ответ: ${answer}`);
    await ctx.answerCallbackQuery();
});

bot.catch((err) => {
    // const ctx = err.context;
    // console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.start();