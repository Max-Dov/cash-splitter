import dotenv from 'dotenv';
import { Bot } from 'grammy'
import {Logger} from './utils/logger.util';
import {Localizer} from './utils/localizer.util';
import {Storage} from './utils/storage.util';
import {countMoneyBotActionCreator, setShareBotActionCreator} from './bot-actions';
import {RegExps} from './constants/regexps.enum';
import {writeJson} from 'fs-extra';

// TODO store member spent info based on chat member is in
// TODO add feature to expand currencies
// TODO add feature to react to message once bot has parsed it
// TODO add a way to customize "money spent" message via strings templating
// TODO add loans processing feature
// TODO add debug mode feature when bot will send error messages to chat or bot owner once having error

const startTime = new Date().getTime();
let isStartupSuccessful = true;

/**
 * Loading environment variables into app.
 */
dotenv.config({
    // uncomment below if you don't have .env.local file
    // path: './config/.env.default'
    path: './config/.env.local',
});

const envVariableSuccessIndicator = process.env.TEST_ENV_VARIABLE_HINT;
if (envVariableSuccessIndicator) {
    Logger.goodInfo('Env variables:', envVariableSuccessIndicator);
} else {
    Logger.error('Env variables: not loaded, check ~/config/README.MD for guidance.');
    isStartupSuccessful = false;
}

/**
 * Loading localizations into Localizer util.
 */
const localizerInitPromise = Localizer.loadLocalization('./config/localization.default.json')
    .then(() => Logger.goodInfo('Localizations: loaded!'))
    .catch((error) => {
        Logger.error(error);
        isStartupSuccessful = false;
    });

/**
 * Loading or creating highly efficient persistent JSON database from disc.
 */
const storageDir = process.env.STORAGE_DIR || './build/storage.json';
const storageInitPromise = Storage.loadStorage(storageDir)
    .then(() => Logger.goodInfo('JSON storage: loaded!'))
    .catch((error) => {
        Logger.error('JSON storage initialization/load failed.', error);
        isStartupSuccessful = false;
    });

Promise.all([localizerInitPromise, storageInitPromise])
    .then(() => {
    /**
     * Declaring bot protocols.
     */
    let bot: Bot;
    try {
        if (isStartupSuccessful) {
            bot = new Bot(process.env.HTTP_API_TOKEN || '');
            bot.hears(...countMoneyBotActionCreator());
            bot.hears(...setShareBotActionCreator());

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
                let partyMember = Storage.storage.partyMembers.find(member => member.username === username);
                if (!partyMember) {
                    partyMember = {
                        name: message.from.first_name,
                        username,
                        shares: 0,
                        totalSpent: 0,
                    };
                    Storage.storage.partyMembers.push(partyMember);
                }
                partyMember.totalSpent += Number(spentAmountArray[0]);
                writeJson(storageDir, Storage.storage)
                    .then(() => {
                        ctx.api.sendChatAction(message.chat.id, 'typing');
                        Logger.info('Successfully saved money spent info!');
                    })
                    .catch(error => Logger.error('Could not write to storage file.', {error}));
            });

            bot.command('spend', ({message}) => {
                Logger.info('Some message just passing by.', {message});
            });

            Logger.goodInfo('Bot protocols: declared!');
        }
    } catch (error) {
        Logger.error('Encountered error while initializing bot protocols', {error});
        isStartupSuccessful = false;
    } finally {
        /**
         * Waking up bot.
         */
        if (isStartupSuccessful) {
            bot!.start().catch(Logger.error);
            Logger.goodInfo('Bot status: ready and working!');
            Logger.info('Bot started in', new Date().getTime() - startTime, 'ms');
        } else {
            Logger.error('Startup was not successful thus bot was not started with broken config to prevent unexpected damage.');
        }
    }
});