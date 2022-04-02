import {Storage} from './storage.util';
import {Logger} from './logger.util';
import {bgGreen} from 'chalk';

export const saveBotMessage = (messageId: number, chatId: number): void | never => {
    const chat = Storage.storage.chats[chatId];
    if (!chat) {
        Logger.error('Could not save bot message due to chat missing!', {chatId, messageId});
        throw Error('Could not find chat by chatId!');
    }
    chat.botMessageIds.push(messageId);
    Logger.info('Saved bot message', bgGreen(messageId), 'from chat', bgGreen(chatId));
};
