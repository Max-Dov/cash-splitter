import {Menu} from '@grammyjs/menu';
import {Context} from 'grammy';
import {Logger} from './logger.util';
import {verifyCtxFields} from './verify-ctx-fields.util';
import {bgGreen, bgRed} from 'chalk';
import {deleteMessage, deleteMessages} from './delete-message.utils';
import {Storage} from './storage.util';

const deleteAllMessages = (ctx: Context): Promise<void> =>
    Promise.all([
        deleteMessagesFromChat(ctx, false),
        deleteMessagesFromChat(ctx, true),
    ]).then(() => {
        closeMenu(ctx);
    }).catch(error => {
        Logger.error('Something went wrong when trying to delete all messages from chat!', bgRed(error.message));
        throw new Error('Could not delete all messages from chat!')
    });

const deleteChatMembersMessages = (ctx: Context): Promise<void> =>
    deleteMessagesFromChat(ctx, false)
        .then(() => closeMenu(ctx))

const deleteBotMessages = (ctx: Context): Promise<void> =>
    deleteMessagesFromChat(ctx, true)
        .then(() => closeMenu(ctx))

const deleteMessagesFromChat = (ctx: Context, areBotMessagesToRemove: boolean): Promise<void> => {
    const chatId = ctx.update.callback_query?.message?.chat.id;
    verifyCtxFields({chatId}, ctx);
    const chat = Storage.storage.chats[String(chatId)];
    if (!chat) {
        Logger.error('Could not delete bot messages due to chat', bgRed(chatId), 'missing!');
        throw Error('Could not find chat by chatId!');
    }
    const messagesDeletionPromises = deleteMessages(
        chat[areBotMessagesToRemove ? 'botMessageIds' : 'processedMessagesIds'],
        chatId as number,
        ctx,
    );
    return Promise.all(messagesDeletionPromises).then(() => {
        chat.processedMessagesIds = [];
        Logger.info('Successfully deleted messages from chat', bgGreen(chatId));
    }).catch(error => {
        Logger.error('Something went wrong when attempting to delete messages.', bgRed(error.message));
        throw new Error('Could not delete messages!');
    });
};

const closeMenu = (ctx: Context): void => {
    const message = ctx.update.callback_query?.message;
    const messageId = message?.message_id;
    const chatId = message?.chat.id;
    verifyCtxFields({messageId, chatId}, ctx);
    deleteMessage(messageId as number, chatId as number, ctx)
        .catch(error => {
            Logger.error('Could not close', bgRed('clear-messages-menu'), 'menu.', bgRed(error.message));
            throw new Error('Could not close menu!');
        });
};

export const clearMessagesMenu = new Menu('clear-messages-menu')
    .text('Delete all 🔥', deleteAllMessages)
    .row()
    .text('Delete chat members messages', deleteChatMembersMessages)
    .row()
    .text('Delete bot messages', deleteBotMessages)
    .row()
    .text('Make bot forget all messages')
    .row()
    .text('Do nothing', closeMenu);

export const openClearMessagesMenu = (ctx: Context): void => {
    ctx.reply('I can delete older messages from above:', {reply_markup: clearMessagesMenu})
        .catch((error) => Logger.error('Something went wrong with', bgRed('clear-messages-menu'), 'menu.', bgRed(error.message)));
};