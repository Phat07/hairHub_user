import { Telegraf } from 'telegraf';

const TOKEN = "7558749441:AAGdxsC-1WYyBNdQkbXYNNvGrulIUWChOTU";
const bot = new Telegraf(TOKEN);
const web_link = "https://www.hairhub.com.vn/";
bot.start((ctx) =>
  ctx.reply("Chào mừng bạn đã đến hairHub", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "web app",
            web_app: { url: web_link },
          },
        ],
      ],
    },
  })
);
// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there')) 
bot.launch();
