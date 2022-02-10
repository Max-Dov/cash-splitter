import dotenv from 'dotenv';
import chalk from 'chalk';
import {Bot} from 'grammy';
import fs from 'fs-extra';
import {Logger} from './utils/loger.util';
import {RegExps} from './contants/regexps.enum';
import {JsonStorage} from './models/json-storage.model';
import {JSON_STORAGE_INIT} from './contants/json-storage-init.const';
import {resolvePartyCashback} from './utils/money-splitting.utils';

/**
 * Loading environment variables into app.
 */
dotenv.config();
Logger.info('Env variables:', chalk.green('loaded!'));

/**
 * Loading or creating highly efficient persistent JSON database from disc.
 */
const storageDir = process.env.STORAGE_DIR || './build/storage.json';
fs.pathExists(storageDir)
    .then(exists => exists
        ? fs.readJson(storageDir)
        : fs.writeJson(storageDir, JSON_STORAGE_INIT).then(() => fs.readJson(storageDir)))
    .then((jsonStorage: JsonStorage) => {
        Logger.info('Chat messages:', chalk.green('loaded!'));
        /**
         * Declaring bot protocols.
         */
        const bot = new Bot(process.env.HTTP_API_TOKEN || '');

        // TODO implement fine message templating mechanism
        const CASHBACK_1ST_SENTENCE = process.env.CASHBACK_1ST_SENTENCE || 'This is what I have got:';
        const CASHBACK_USERNAME_HAS_TO_PAY = process.env.CASHBACK_USERNAME_HAS_TO_PAY || 'has to pay';
        const CASHBACK_USERNAME_IS_GETTING_PAID = process.env.CASHBACK_USERNAME_IS_GETTING_PAID || 'is getting cashback of';
        const CASHBACK_USERNAME_IS_EVEN = process.env.CASHBACK_USERNAME_IS_EVEN || 'has spent exactly to it shares!';
        const CASHBACK_LAST_SENTENCE = process.env.CASHBACK_LAST_SENTENCE || 'That is it!';
        bot.hears(new RegExp(process.env.MESSAGE_COUNT_REQUEST_REGEXP || RegExps.COUNT_MONEY_COMMAND_DEFAULT, 'i'), ctx => {
            Logger.command('Hearing money count request!');
            ctx.reply(process.env.MESSAGE_COUNT_RESPONSE || 'Processing!').then(() => {
                const partyCashback = resolvePartyCashback(jsonStorage.partyMembers);
                const replyMessage =
                    CASHBACK_1ST_SENTENCE
                    + '\n\n'
                    + partyCashback.map(({name, cashback, cashin}) => {
                        const isGettingCashback = cashback >= cashin;
                        const cash = Math.abs(cashback - cashin);
                        if (cash === 0) {
                            return `${name} ${CASHBACK_USERNAME_IS_EVEN}`;
                        }
                        return `${name} ${isGettingCashback ? CASHBACK_USERNAME_IS_GETTING_PAID : CASHBACK_USERNAME_HAS_TO_PAY} ${cash}`;
                    }).join('\n')
                    + '\n\n'
                    + CASHBACK_LAST_SENTENCE;
                ctx.reply(replyMessage);
            });
            // TODO add button to remove old messages
        });

        bot.hears(new RegExp(process.env.SET_SHARE_REQUEST_REGEXP || RegExps.SET_MY_SHARE_COMMAND_DEFAULT, 'i'), ctx => {
            Logger.command('New message to set share!');
            const message = ctx.message;
            if (!message) {
                Logger.error('Could not figure out message from context.', {ctx});
                return;
            }
            const username = message.from?.username;
            if (!username) {
                Logger.error('Could not figure out username from message.', {message});
                return;
            }
            const messageText = message.text;
            if (!messageText) {
                Logger.error('Could not figure out text from message.', {message});
                return;
            }
            const shareNumberArray = RegExps.NUMBER_AT_START.exec(messageText);
            if (!shareNumberArray) {
                Logger.error('Could not figure out share number from messageText.', {messageText});
                return;
            }
            let partyMember = jsonStorage.partyMembers.find(member => member.username === username);
            if (!partyMember) {
                partyMember = {
                    name: message.from.first_name,
                    username,
                    shares: 0,
                    totalSpent: 0,
                };
                jsonStorage.partyMembers.push(partyMember);
            }
            partyMember.shares = Number(shareNumberArray[0]);
            fs.writeJson(storageDir, jsonStorage)
                .then(() => {
                    ctx.api.sendChatAction(message.chat.id, 'typing');
                    ctx.reply(process.env.SET_SHARE_RESPONSE || 'Share is set!');
                    Logger.info('Successfully saved share info!');
                })
                .catch(error => Logger.error('Could not write to storage file.', {error}));
        });

        bot.hears(RegExps.NUMBER_WITH_OPTIONAL_WORDS, ctx => {
            Logger.command('New money well spent message!');
            const message = ctx.message;
            if (!message) {
                Logger.error('Could not figure out message from context.', {ctx});
                return;
            }
            const username = message.from?.username;
            if (!username) {
                Logger.error('Could not figure out username from message.', {message});
                return;
            }
            const messageText = message.text;
            if (!messageText) {
                Logger.error('Could not figure out text from message.', {message});
                return;
            }
            const spentAmountArray = RegExps.NUMBER_AT_START.exec(messageText);
            if (!spentAmountArray) {
                Logger.error('Could not figure out spent amount from messageText.', {messageText});
                return;
            }
            let partyMember = jsonStorage.partyMembers.find(member => member.username === username);
            if (!partyMember) {
                partyMember = {
                    name: message.from.first_name,
                    username,
                    shares: 0,
                    totalSpent: 0,
                };
                jsonStorage.partyMembers.push(partyMember);
            }
            partyMember.totalSpent += Number(spentAmountArray[0]);
            fs.writeJson(storageDir, jsonStorage)
                .then(() => {
                    ctx.api.sendChatAction(message.chat.id, 'typing');
                    Logger.info('Successfully saved money spent info!');
                })
                .catch(error => Logger.error('Could not write to storage file.', {error}));
        });

        bot.on('message', ({message}) => {
            Logger.info('Some message just passing by.', {message});
        });

        Logger.info('Bot protocols:', chalk.green('declared!'));
        /**
         * Waking up bot.
         */
        bot.start().catch(Logger.error);
        Logger.info('Bot status:', chalk.green('ready and working!'));
    });