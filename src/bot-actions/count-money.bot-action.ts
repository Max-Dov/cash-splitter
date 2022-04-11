import {
    Localizer,
    Logger,
    prepareBotCommandAction,
    saveBotMessage,
    verifyCtxFields,
    saveMessageAsProcessed,
    prepareBotAction,
    openClearMessagesMenu, getOrCreateParty, getPartyPayouts
} from '@utils';
import {BotAction, BotCommandAction, CommandHandler} from '@models';
import {BotCommandsKeys, BotMessagesKeys, ChatCommands} from '@constants';

/**
 * Figure out cashback and cashin for everyone and send that in chat.
 */
const commandHandler: CommandHandler = (ctx) => {
    const prependMessagePromise = ctx.reply(Localizer.message(BotMessagesKeys.COUNT_MONEY_RESPONSE));
    prependMessagePromise
        .then((ctx) => {
            const chatId = ctx?.chat.id;
            const messageId = ctx?.message_id;
            verifyCtxFields({chatId, messageId}, ctx);
            saveBotMessage(messageId as number, chatId as number);
        })
        .catch((error) => {
            throw Error(error);
        });
    const chatId = ctx?.message?.chat.id;
    const messageId = ctx?.message?.message_id;
    verifyCtxFields({chatId, messageId}, ctx);
    const chat = getOrCreateParty(chatId as number)
    if (Object.keys(chat.partyMembers).length === 0) {
        ctx.api.sendMessage(chatId as number, Localizer.message(BotMessagesKeys.NOTHING_POSTED_IN_CHAT_YET))
            .catch((error) => {
                throw Error(error);
            });
        Logger.warning('Attempted to count money in chat with no messages?');
        return;
    }
    const partyCashback = getPartyPayouts(chat);
    const payoutMessage = Localizer.message(BotMessagesKeys.COUNT_MONEY_RESULTS, {partyCashback});
    saveMessageAsProcessed(messageId as number, chatId as number);
    ctx.api.sendMessage(chatId as number, payoutMessage)
        .catch((error) => {
            throw Error(error);
        })
        .then((botMessageCtx) => {
            const chatId = botMessageCtx?.chat.id;
            const messageId = botMessageCtx?.message_id;
            verifyCtxFields({chatId, messageId}, botMessageCtx);
            saveBotMessage(messageId as number, chatId as number);
            openClearMessagesMenu(ctx);
        });
};

export const countMoneyBotActionCreator = (): BotAction => prepareBotAction(
    BotCommandsKeys.COUNT_MONEY,
    commandHandler,
);

export const countMoneyBotCommandActionCreator = (): BotCommandAction => prepareBotCommandAction(
    ChatCommands.COUNT_MONEY,
    commandHandler,
);
