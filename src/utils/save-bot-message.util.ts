import {Storage} from './storage.util';
import {Logger} from './logger.util';
import {bgGreen} from 'chalk';

export const saveBotMessage = (messageId: number, chatId: number): void => {
    const chat = Storage.storage.chats[chatId];
    if (!chat) {
        Logger.warning('Could not save bot message due to chat missing!', {chatId, messageId});
        return;
    }
    chat.botMessageIds.push(messageId);
    Logger.info('Saved bot message', bgGreen(messageId), 'from chat', bgGreen(chatId));
};
