require('dotenv').config();
const { Bot } = require("grammy");

// Create a bot object
const bot = new Bot(process.env.HTTP_API_TOKEN);

// Register listeners to handle messages
bot.on("message:text", (ctx: any) => ctx.reply("Echo: " + ctx.message.text));

// Start the bot (using long polling)
bot.start();