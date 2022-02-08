require('dotenv').config();
import chalk from 'chalk';
import { Bot } from 'grammy';

// Create a bot object
const bot = new Bot(process.env.HTTP_API_TOKEN || '');

bot.command('start', (ctx) => ctx.reply('Ready to count cash moneys!'));

// Register listeners to handle messages
bot.on('message:text', (ctx: any) => ctx.reply('Echo: ' + ctx.message.text));

// Start the bot (using long polling)
bot.start();

console.log(chalk.red.bold('I woke up'));