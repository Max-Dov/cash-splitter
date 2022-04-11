import {bgRed} from 'chalk';
import {Party} from '@models';
import {Localizer, Logger, Storage} from '@utils';
import {BotMessagesKeys} from '@constants';

/**
 * Generates payout string for every party member. E.g. "Max owes 25 $ to group (pizza, theater tickets)".
 */
export const getPartyPayouts = (party: Party): string =>
    Object.entries(party.partyMembers).map(([username, member]) => {
        const {payoutCurrencyName, supportedCurrencies} = Storage.storage;
        /**
         * Calculate net for every currency by calculating totalSpent - totalOwed
         */
        const currencyToMoneyNet = new Map<string, number>(); // currency to money net
        Object.entries(member.totalSpent || {})
            .forEach(([currency, totalSpent]) => {
                currencyToMoneyNet.set(currency, totalSpent);
            });
        Object.entries(member.totalOwed || {})
            .forEach(([currency, owedAmount]) => {
                const amountSpent = member.totalSpent[currency] || 0;
                currencyToMoneyNet.set(currency, amountSpent - owedAmount);
            });
        /**
         * Figure out payout amount from net amount for every currency.
         */
        const payoutAmount = [...currencyToMoneyNet.entries()]
            .map(([currency, netAmount]) => {
                const supportedCurrency = supportedCurrencies
                    .find(({currencyName}) => currencyName === currency);
                if (!supportedCurrency) {
                    Logger.error('Can not find supported currency!', bgRed({
                        currency,
                        supportedCurrencies
                    }));
                    throw new Error('Can not find supported currency!');
                }
                // convert netAmount to payout currency amount
                return Math.trunc(netAmount * supportedCurrency.currencyToPayoutCurrency * 100) / 100;
            }).reduce((payoutAmount, someCurrencyPayout) => payoutAmount + someCurrencyPayout, 0);
        /**
         * Construct message from payout amount.
         */
        let message;
        const items = `(${member.obtainedItems.join(', ')})`;
        if (payoutAmount > 0) {
            message = Localizer.message(
                BotMessagesKeys.USERNAME_GETS_CASHBACK_FROM_GROUP,
                {username, cashback: `${payoutAmount} ${payoutCurrencyName}`}
            );
            message += '\n' + Localizer.message(BotMessagesKeys.ITEMS_SPEND_MONEY_ON, {items});
        } else if (payoutAmount < 0) {
            message = Localizer.message(
                BotMessagesKeys.USERNAME_SHOULD_PAY_TO_GROUP,
                {username, cashin: `${-payoutAmount} ${payoutCurrencyName}`}
            );
            message += '\n' + Localizer.message(BotMessagesKeys.ITEMS_SPEND_MONEY_ON, {items});
        } else {
            message = Localizer.message(
                BotMessagesKeys.USERNAME_IS_EVEN_WITH_EVERYONE,
                {username}
            );
        }
        return message;
    })
    .join('\n\n');