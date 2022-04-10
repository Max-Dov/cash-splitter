import {Chat} from '@grammyjs/types';
import {Party} from '@models';
import {createNewParty, Storage} from '@utils';

/**
 * Extract chat from Storage or creates new chat in Storage and returns it.
 * @param chatId - chatId associated with party.
 */
export const getOrCreateParty = (chatId: Chat['id']): Party => {
    const storage = Storage.storage;
    let chat = storage.chats[chatId as number];
    if (!chat) {
        chat = createNewParty({chatId: chatId as number});
        storage.chats[chatId] = chat;
    }
    return chat;
};
