import dotenv from 'dotenv';
import {Bot} from 'grammy';
import {
    countMoneyBotActionCreator,
    setShareBotActionCreator,
    readMoneySpentBotActionCreator,
    countMoneyBotCommandActionCreator,
    openClearMessagesMenuBotActionCreator, sendSummaryMessageBotActionCreator,
} from '@bot-actions';
import {clearMessagesMenu, getRedErrorMessage, Localizer, Logger, Storage} from '@utils';
import {ChatCommands} from '@constants';

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
                    {command: ChatCommands.SEND_SUMMARY_MESSAGE, description: 'Send summary message with updates on every message.'},
                    {command: ChatCommands.CLEAN_MESSAGES, description: 'Bring up menu to remove old messages.'},
                ]);
                bot.use(clearMessagesMenu);
                bot.hears(...countMoneyBotActionCreator());
                bot.command(...countMoneyBotCommandActionCreator());
                bot.command(...openClearMessagesMenuBotActionCreator());
                bot.command(...sendSummaryMessageBotActionCreator());
                bot.hears(...setShareBotActionCreator());
                bot.hears(...readMoneySpentBotActionCreator());
                bot.on('message', () => {
                    Logger.info('Some message just passing by.');
                });
                bot.catch((error) => {
                    Logger.error('Bot unexpected error!', getRedErrorMessage(error));
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
                bot!.start().catch((error) => {
                    Logger.error('Bot unexpected error!', getRedErrorMessage(error));
                });
                Logger.goodInfo('Bot status: ready and working!');
                Logger.info('Bot started in', new Date().getTime() - startTime, 'ms');
            } else {
                Logger.error('Startup was not successful thus bot was not started with broken config to prevent unexpected damage.');
            }
        }
    });