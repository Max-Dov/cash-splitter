import {PartyMember} from '@models';
import {Chat, Message} from '@grammyjs/types';

/**
 * Party info.
 */
export interface Party {
    /**
     * Party members who participated at least in one transaction.
     */
    partyMembers: {
        [key in PartyMember['username']]: PartyMember
    };
    /**
     * Messages that were heard and processed by bot.
     */
    processedMessagesIds: Message['message_id'][];
    /**
     * Messages that were sent by bot.
     */
    botMessageIds: Message['message_id'][];
    /**
     * Chat ID associated with party.
     */
    chatId: Chat['id'];
}