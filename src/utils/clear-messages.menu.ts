import {Menu} from '@grammyjs/menu';
import {Context} from 'grammy';
import {bgGreen, bgRed} from 'chalk';
import {
    deleteMessage,
    deleteMessages,
    getOrCreateParty,
    getRedErrorMessage,
    Logger,
    Storage,
    verifyCtxFields
} from '@utils';

const deleteAllMessages = (ctx: Context): Promise<void> =>
    Promise.all([
        deleteMessagesFromChat(ctx, false),
        deleteMessagesFromChat(ctx, true),
    ]).then(() => {
        closeMenu(ctx);
    }).catch(error => {
        Logger.error('Something went wrong when trying to delete all messages from chat!', getRedErrorMessage(error));
        throw new Error('Could not delete all messages from chat!');
    });

const deleteChatMembersMessages = (ctx: Context): Promise<void> =>
    deleteMessagesFromChat(ctx, false)
        .then(() => closeMenu(ctx));

const deleteBotMessages = (ctx: Context): Promise<void> =>
    deleteMessagesFromChat(ctx, true)
        .then(() => closeMenu(ctx));

const deleteMessagesFromChat = (ctx: Context, areBotMessagesToRemove: boolean): Promise<void> => {
    const chatId = ctx.update.callback_query?.message?.chat.id;
    verifyCtxFields({chatId}, ctx);
    const chat = getOrCreateParty(chatId as number);
    const messagesDeletionPromises = deleteMessages(
        chat[areBotMessagesToRemove ? 'botMessageIds' : 'processedMessagesIds'],
        chatId as number,
        ctx,
    );
    return Promise.all(messagesDeletionPromises).then(() => {
        chat[areBotMessagesToRemove ? 'botMessageIds' : 'processedMessagesIds'] = [];
        Logger.info('Successfully deleted messages from chat', bgGreen(chatId));
        if (!areBotMessagesToRemove) { // then should clear obtained items as well
            Object.values(chat.partyMembers)
                .forEach(member => {
                    member.obtainedItems = [];
                    member.totalOwed = {};
                    member.totalSpent = {};
                });
        }
    }).catch(error => {
        Logger.error('Something went wrong when attempting to delete messages.', getRedErrorMessage(error));
        throw new Error('Could not delete messages!');
    }).finally(Storage.saveStorage);
};

const forgetMessages = (ctx: Context): void => {
    const chatId = ctx.update.callback_query?.message?.chat.id;
    verifyCtxFields({chatId}, ctx);
    const chat = getOrCreateParty(chatId as number);
    chat.processedMessagesIds = [];
    chat.botMessageIds = [];
    Object.values(chat.partyMembers)
        .forEach(member => {
            member.obtainedItems = [];
            member.totalOwed = {};
            member.totalSpent = {};
        });
    Logger.info('Successfully forgot messages from chat', bgGreen(chatId));
    Storage.saveStorage()
        .then(() => closeMenu(ctx));
};

const closeMenu = (ctx: Context): void => {
    const message = ctx.update.callback_query?.message;
    const messageId = message?.message_id;
    const chatId = message?.chat.id;
    verifyCtxFields({messageId, chatId}, ctx);
    deleteMessage(messageId as number, chatId as number, ctx, 'clear-messages-menu')
        .catch(error => {
            Logger.error('Could not close', bgRed('clear-messages-menu'), 'menu.', getRedErrorMessage(error));
            throw new Error('Could not close menu!');
        });
};

export const clearMessagesMenu = new Menu('clear-messages-menu')
    .text('Delete all ????', deleteAllMessages)
    .row()
    .text('Delete chat members messages', deleteChatMembersMessages)
    .row()
    .text('Delete bot messages', deleteBotMessages)
    .row()
    .text('Make bot forget all messages', forgetMessages)
    .row()
    .text('Do nothing', closeMenu);

export const openClearMessagesMenu = (ctx: Context): void => {
    ctx.reply('I can delete older messages from above:', {reply_markup: clearMessagesMenu})
        .catch((error) => Logger.error('Something went wrong with', bgRed('clear-messages-menu'), 'menu.', getRedErrorMessage(error)));
};