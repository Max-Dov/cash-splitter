import dotenv from 'dotenv';
import {Bot} from 'grammy';
import {Logger} from './utils/logger.util';
import {Localizer} from './utils/localizer.util';
import {Storage} from './utils/storage.util';
import {countMoneyBotActionCreator, setShareBotActionCreator} from './bot-actions';
import {readMoneySpentBotActionCreator} from './bot-actions/read-money-spent.bot-action';

// TODO store member spent info based on chat member is in
// TODO add feature to expand currencies
// TODO add feature to react to message once bot has parsed it
// TODO add feature to reset chat info
// TODO add a way to customize "money spent" message via strings templating
// TODO add feature to process loans
// TODO add feature of debug mode when bot will send error messages to chat or bot owner once having error
// TODO add feature to support message editing
// TODO add feature to calculate payouts only when command to count money is sent (shares might be not updated before that)
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
                bot.hears(...countMoneyBotActionCreator());
                bot.hears(...setShareBotActionCreator());
                bot.hears(...readMoneySpentBotActionCreator());
                bot.on('message', ({message}) => {
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