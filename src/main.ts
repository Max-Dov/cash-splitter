import dotenv from 'dotenv';
import {Bot} from 'grammy';
import {Logger} from './utils/logger.util';
import {Localizer} from './utils/localizer.util';
import {Storage} from './utils/storage.util';
import {countMoneyBotActionCreator, setShareBotActionCreator} from './bot-actions';
import {readMoneySpentBotActionCreator} from './bot-actions/read-money-spent.bot-action';
import {clearMessagesMenu, openClearMessagesMenu} from './utils/clear-messages.menu';
import {ChatCommands} from './constants/chat-commands.enum';

// TODO add feature to expand currencies via commands
// TODO add feature to reset chat info
// TODO add command for clearMessagesMenu
// TODO add command for counting money
// TODO add feature to display owedItems via bot.
// TODO add a way to customize "money spent" message via strings templating
// TODO add feature of debug mode when bot will send error messages to chat or bot owner once having error
// TODO add feature to support message editing

// TODO bug - if message is forwarded from user who hides their link, then it won't pick that user up.
// TODO fix to above: send message when following happens and don't process message
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
const storageInitPromise = Storage.loadStorage()
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
                bot.api.setMyCommands([
                    {command: ChatCommands.COUNT_MONEY, description: 'Count cashback and cashin for everyone in chat.'},
                    {command: ChatCommands.CLEAN_MESSAGES, description: 'Bring up the menu to remove old messages.'},
                ]);
                bot.use(clearMessagesMenu);
                const countMoneyBotAction = countMoneyBotActionCreator();
                bot.hears(...countMoneyBotAction);
                bot.command(ChatCommands.COUNT_MONEY, countMoneyBotAction[1]);
                bot.command(ChatCommands.CLEAN_MESSAGES, openClearMessagesMenu);
                bot.hears(...setShareBotActionCreator());
                bot.hears(...readMoneySpentBotActionCreator());
                bot.on('message', () => {
                    Logger.info('Some message just passing by.');
                });
                bot.catch((ctx) => {
                    Logger.error('Bot unexpected error!', ctx.message);
                });
                Logger.goodInfo('Bot protocols: declared!');
            }
        } catch (error) {
            Logger.error('Encountered error while initializing bot protocols', {error: (error as Error).message});
            isStartupSuccessful = false;
        } finally {
            /**
             * Waking up bot.
             */
            if (isStartupSuccessful) {
                bot!.start().catch((ctx) => {
                    Logger.error('Bot unexpected error!', ctx.message);
                });
                Logger.goodInfo('Bot status: ready and working!');
                Logger.info('Bot started in', new Date().getTime() - startTime, 'ms');
            } else {
                Logger.error('Startup was not successful thus bot was not started with broken config to prevent unexpected damage.');
            }
        }
    });