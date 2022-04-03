import {Context} from 'grammy';
import {Logger} from './logger.util';
import {bgGray, bgRed} from 'chalk';

export const deleteMessage = (messageId: number, chatId: number, ctx: Context, note: string = ''): Promise<true> => {
    const promise = ctx.api.deleteMessage(chatId as number, messageId as number);
    promise
        .then(() => Logger.info(
            `Deleted message ${bgGray(messageId)} from chat ${bgGray(chatId)}`,
            note ? `(${note})` : '',
        ))
        .catch((error) => {
            Logger.error(
                `Could not delete message ${bgRed(messageId)} from chat ${bgRed(chatId)}`,
                note ? `(${note})` : '',
                bgRed(error.message),
            );
        });
    return promise;
};

export const deleteMessages = (messageIds: number[], chatId: number, ctx: Context): Promise<true>[] =>
    messageIds.map(messageId => deleteMessage(messageId, chatId, ctx));