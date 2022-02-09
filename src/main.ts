import dotenv from 'dotenv';
import chalk from 'chalk';
import {Bot} from 'grammy';
import fs from 'fs-extra';
import {Storage} from './models/storage.model';
import {Logger} from './utils/loger.util';

/**
 * Loading environment variables into process.
 */
dotenv.config();
Logger.info('env variables:', chalk.green('loaded'));

/**
 * Loading or creating highly efficient persistent JSON database from disc.
 */
const messagesStorageDir = process.env.MESSAGES_STORAGE_DIR || './build/messages.json';
fs.pathExists(messagesStorageDir)
    .then(exists => exists
        ? fs.readJson(messagesStorageDir)
        : fs.writeJson(messagesStorageDir, {} as Storage).then(() => fs.readJson(messagesStorageDir)))
    .then(chatMessages => {
        Logger.info('chat messages:', chalk.green('loaded'));
        /**
         * Declaring bot protocols.
         */
        const bot = new Bot(process.env.HTTP_API_TOKEN || '');

        bot.on('message', (ctx) => {
            console.log(ctx.message.text);
        });

        bot.hears(process.env.MESSAGE_COUNT_REQUEST_REGEXP || '', ({message, senderChat, msg}) => {
            console.info({message, senderChat, msg});
        });

        Logger.info('bot protocols:', chalk.green('declared'));
        /**
         * Waking up bot.
         */
        bot.start().catch(Logger.error);
        Logger.info('bot status:', chalk.green('ready and working'));
    });