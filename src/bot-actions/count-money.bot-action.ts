import {Storage} from '../utils/storage.util';
import {Localizer} from '../utils/localizer.util';
import {BotMessagesKeys} from '../constants/bot-messages-keys.enum';
import {BotCommandsKeys} from '../constants/bot-commands-keys.enum';
import {prepareBotAction} from '../utils/prepare-bot-action.util';
import {BotAction} from '../models/bot-action.model';
import {verifyCtxFields} from '../utils/verify-ctx-fields.util';
import {Logger} from '../utils/logger.util';
import {bgRed} from 'chalk';

/**
 * Figure out cashback and cashin for everyone and send that in chat.
 * TODO add ability to remove old messages by button
 */
export const countMoneyBotActionCreator = (): BotAction => prepareBotAction(
    BotCommandsKeys.COUNT_MONEY,
    ctx => {
        ctx.reply(Localizer.message(BotMessagesKeys.COUNT_MONEY_RESPONSE))
            .then(() => {
                const chatId = ctx?.message?.chat.id;
                verifyCtxFields({chatId}, ctx);
                const chat = Storage.storage.chats[String(chatId)];
                if (!chat) {
                    ctx.api.sendMessage(chatId as number, Localizer.message(BotMessagesKeys.NOTHING_POSTED_IN_CHAT_YET))
                        .catch((error) => {
                            throw Error(error);
                        });
                    Logger.warning('Attempted to count money in chat with no messages?');
                    return;
                }
                const payoutStrings = Object.entries(chat.partyMembers || {})
                    .map(([username, member]) => {
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
                                {username, cashback: `${payoutAmount}${payoutCurrencyName}`}
                            );
                            message += '\n' + Localizer.message(BotMessagesKeys.ITEMS_SPEND_MONEY_ON, {items});
                        } else if (payoutAmount < 0) {
                            message = Localizer.message(
                                BotMessagesKeys.USERNAME_SHOULD_PAY_TO_GROUP,
                                {username, cashin: `${-payoutAmount}${payoutCurrencyName}`}
                            );
                            message += '\n' + Localizer.message(BotMessagesKeys.ITEMS_SPEND_MONEY_ON, {items});
                        } else {
                            message = Localizer.message(
                                BotMessagesKeys.USERNAME_IS_EVEN_WITH_EVERYONE,
                                {username}
                            );
                        }
                        return message;
                    });
                const payoutMessage = Localizer.message(BotMessagesKeys.COUNT_MONEY_RESULTS, {
                    partyCashback: payoutStrings.join('\n\n')
                });
                ctx.api.sendMessage(chatId as number, payoutMessage)
                    .catch((error) => {
                        throw Error(error);
                    });
            })
            .catch((error) => {
                throw Error(error);
            });
    },
);