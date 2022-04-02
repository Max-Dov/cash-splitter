import {Party} from './party.model';

/**
 * Storage structure.
 * Note: it IS mutated during application use.
 */
export interface JsonStorage {
    /**
     * Set of (chatId, Party) pairs.
     */
    chats: {
       [chatId in string]?: Party
    }
    /**
     * List of supported currencies. Can be anything members are calling their money.
     */
    supportedCurrencies: {
        currencyName: string; // e.g. "$", "руб"
        currencyToPayoutCurrency: number; // how much 1 unit of currency costs in payout currency.
    }[];
    /**
     * Default currency name if member does not specify currency.
     */
    defaultCurrencyName: JsonStorage['supportedCurrencies'][number]['currencyName'];
    /**
     * Payout currency name used by bot to display payouts.
     */
    payoutCurrencyName: JsonStorage['supportedCurrencies'][number]['currencyName'];
}