import {JsonStorage} from '../models/json-storage.model';

/**
 * App JSON storage initialization value.
 */
export const JSON_STORAGE_INIT: Readonly<JsonStorage> = {
    chats: {},
    supportedCurrencies: [{
        currencyName: '$',
        currencyToPayoutCurrency: 1,
    }, {
        currencyName: 'gel',
        currencyToPayoutCurrency: 0.32, // 01.04.2022
    }],
    defaultCurrencyName: 'gel',
    payoutCurrencyName: '$',
}