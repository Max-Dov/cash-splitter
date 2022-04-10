import {BotCommandAction} from '@models';
import {
    getOrCreateParty,
    getRedErrorMessage,
    Logger,
    prepareBotCommandAction,
    saveMessageAsProcessed,
    Storage,
    verifyCtxFields
} from '@utils';
import {ChatCommands} from '@constants';

/**
 * Send summary message to chat, that would be updated by bot on every money spent message.
 * Party members can pin message and use it instead of "count_money" command.
 */
export const sendSummaryMessageBotActionCreator = (): BotCommandAction => prepareBotCommandAction(
    ChatCommands.SEND_SUMMARY_MESSAGE,
    (ctx) => {
        const chatId = ctx?.message?.chat.id;
        const messageId = ctx?.message?.message_id;
        verifyCtxFields({chatId, messageId}, ctx);
        ctx.reply('Summary message. Once someone would send money message to chat summary message would be updated!')
            .then(summaryMessage => {
                const summaryMessageId = summaryMessage.message_id;
                verifyCtxFields({summaryMessageId}, summaryMessage);
                getOrCreateParty(chatId as number).summaryMessageId = summaryMessageId;
                Storage.saveStorage()
                    .catch(error => Logger.error('Could not write to storage file.', getRedErrorMessage(error)));
            })
            .catch(error => {
                Logger.error('Could not send summary message!', getRedErrorMessage(error));
                throw new Error('Could not send summary message!');
            });
        saveMessageAsProcessed(messageId as number, chatId as number);
    }
);
