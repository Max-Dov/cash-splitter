import {Party} from '@models';

type PartyInit = Partial<Omit<Party, 'chatId'>> & {chatId: Party['chatId']}

/**
 * Creates new party. All fields but "chatId" are optional.
 * @param initObject - object initialization fields for party; chatId is required.
 */
export const createNewParty = (initObject: PartyInit): Party => ({
    partyMembers: {},
    processedMessagesIds: [],
    botMessageIds: [],
    ...initObject
})