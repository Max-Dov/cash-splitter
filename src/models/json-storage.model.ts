import {Party} from './party.model';

/**
 * Storage structure.
 * Note: it IS mutated during application use.
 */
export interface JsonStorage {
    /**
     * Set of <chatId, Party> pairs.
     */
    chats: {
       [chatId in string]?: Party
    }
    /**
     * List of supported currencies, e.g. "$", "руб". Can be anything members are calling their money.
     */
    supportedCurrencies: string[];
    defaultCurrency: string;
}