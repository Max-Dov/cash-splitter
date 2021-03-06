import {bgGreen} from 'chalk';
import {Storage, Logger} from '@utils';

/**
 * Save user message as successfully processed by bot.
 */
export const saveMessageAsProcessed = (messageId: number, chatId: number): void | never => {
    const chat = Storage.storage.chats[chatId];
    if (!chat) {
        Logger.error('Could not save message as processed due to chat missing!', {chatId, messageId});
        throw Error('Could not find chat by chatId!');
    }
    chat.processedMessagesIds.push(messageId);
    Logger.info('Processed message', bgGreen(messageId), 'from chat', bgGreen(chatId));
};
