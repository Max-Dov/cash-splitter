import {Storage} from './storage.util';
import {Logger} from './logger.util';
import {bgGreen} from 'chalk';

export const saveMessageAsProcessed = (messageId: number, chatId: number): void | never => {
    const chat = Storage.storage.chats[chatId];
    if (!chat) {
        Logger.error('Could not save message as processed due to chat missing!', {chatId, messageId});
        throw Error('Could not find chat by chatId!');
    }
    chat.processedMessagesIds.push(messageId);
    Logger.info('Processed message', bgGreen(messageId), 'from chat', bgGreen(chatId));
};
