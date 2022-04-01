import {BotAction} from '../models/bot-action.model';
import {Localizer} from '../utils/localizer.util';
import {BotCommandsKeys} from '../constants/bot-commands-keys.enum';
import {Storage} from '../utils/storage.util';
import {Logger} from '../utils/logger.util';
import {prepareBotAction} from '../utils/prepare-bot-action.util';
import {verifyCtxFields} from '../utils/verify-ctx-fields.util';
import {bgYellow} from 'chalk';

export const readMoneySpentBotActionCreator = (): BotAction | never => {
    /**
     * Currencies are dynamically changing and placed in Storage, so when bot starts it has to look into Storage.
     */
    const commandWithPlaceholder = Localizer.commandAsString(BotCommandsKeys.ADD_MONEY_SPENT);
    const currencies = Storage.storage.supportedCurrencies.map(({currencyName}) => {
        if (currencyName === '$') {
            return '\\$'
        }
        return currencyName;
    }).join('|');
    const regexpCommand = new RegExp(
        Localizer.replacePlaceholders(commandWithPlaceholder, {currencies})
    );
    return prepareBotAction(
        BotCommandsKeys.ADD_MONEY_SPENT,
        (ctx) => {
            const [
                // TODO use named groups instead
                , // whole message
                spenderName, // e.g. '@max'
                amountSpent, // e.g. '25'
                messageCurrency, // e.g. '$'
                excludedMembers, // e.g. '-@mike -@michelle'
                includedMembers, // e.g. '@mark @marie'
                note, // e.g. 'pizza to everyone'
            ] = ctx.match as RegExpMatchArray;
            // TODO trim "via regexp"
            const storage = Storage.storage;
            const currency = messageCurrency?.trim() || storage.defaultCurrencyName;
            const message = ctx.message;
            const messageId = message?.message_id;
            const chatId = message?.chat.id;
            const senderUsername = message?.forward_from?.username || message?.from?.username;
            verifyCtxFields({chatId, senderUsername, messageId}, ctx);

            // extract chat
            const chats = storage.chats;
            let chat = chats[String(chatId)];
            if (!chat) {
                chat = {partyMembers: {}};
                chats[String(chatId)] = chat;
            }
            const partyMembers = chat.partyMembers;

            // extract spender
            // TODO trim "via regexp"; fix regexp groups to not include space
            const spenderUsername = spenderName?.trim() || ('@' + senderUsername);
            let spender = partyMembers[spenderUsername];
            if (!spender) {
                Logger.info('New party member:', bgYellow(spenderUsername));
                spender = {
                    username: spenderUsername,
                    totalSpent: {[currency]: 0},
                    totalOwed: {},
                    shares: 1,
                    obtainedItems: [],
                };
                partyMembers[spenderUsername] = spender;
            }

            // validate excludedMembers and includedMembers
            if (excludedMembers && includedMembers) {
                Logger.error('Message can not contain both excluded and included members!', {
                    excludedMembers,
                    includedMembers,
                });
                throw new Error('Message can not contain both excluded and included members!');
                // TODO send message in chat that it's tricky edgecase that can not be processed by bot.
            }

            // apply totalSpent
            let spenderTotalSpent = spender.totalSpent;
            spenderTotalSpent[currency] = (spenderTotalSpent[currency] || 0) + Number(amountSpent);

            // apply totalOwe
            let oweMembersMap = new Map(
                Object.entries(partyMembers) // by default everyone in chat
            );
            if (excludedMembers) {
                excludedMembers
                    .replace(/-/g, '')
                    .trim()
                    .split(new RegExp('\\s+'))
                    .forEach(memberUsername => oweMembersMap.delete(memberUsername));
            } else if (includedMembers) {
                oweMembersMap = new Map();
                includedMembers
                    .trim()
                    .split(new RegExp('\\s+'))
                    .forEach(memberUsername => {
                        let member = partyMembers[memberUsername];
                        if (!member) {
                            Logger.info('New party member:', bgYellow(memberUsername));
                            member = {
                                username: memberUsername,
                                totalSpent: {[currency]: 0},
                                totalOwed: {},
                                shares: 1,
                                obtainedItems: [],
                            };
                            partyMembers[memberUsername] = member;
                        }
                        oweMembersMap.set(memberUsername, member);
                    });
            }
            let oweMembersShareSum = 0;
            for (const [, member] of oweMembersMap) {
                oweMembersShareSum += member.shares;
            }
            for (const [, member] of oweMembersMap) {
                const owedAmount = Math.trunc(Number(amountSpent) / oweMembersShareSum * member.shares * 100) / 100;
                member.obtainedItems.push(`${owedAmount}${currency} ${note || 'something mysterious with no name'}`);
                member.totalOwed[currency] = (member.totalOwed[currency] || 0) + owedAmount;
            }
            Storage.saveStorage()
                .then(() => {
                    Logger.info('Successfully saved money spent info!');
                })
                .catch(error => Logger.error('Could not write to storage file.', {error}));
        },
        regexpCommand
    );
};
