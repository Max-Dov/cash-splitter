import {BotAction} from '../models/bot-action.model';
import {Localizer} from '../utils/localizer.util';
import {BotCommandsKeys} from '../constants/bot-commands-keys.enum';
import {Storage} from '../utils/storage.util';
import {Logger} from '../utils/logger.util';
import {prepareBotAction} from '../utils/prepare-bot-action.util';
import chalk from 'chalk';
import {verifyCtxFields} from '../utils/verify-ctx-fields.util';

export const readMoneySpentBotActionCreator = (): BotAction | never => {
    /**
     * Currencies are dynamically changing and placed in Storage, so when bot starts it has to look into Storage.
     */
    const commandWithPlaceholder = Localizer.commandAsString(BotCommandsKeys.ADD_MONEY_SPENT);
    const currencies = Storage.storage.supportedCurrencies.join('|');
    const regexpCommand = new RegExp(
        Localizer.replacePlaceholders(commandWithPlaceholder, {currencies})
    );
    return prepareBotAction(
        BotCommandsKeys.ADD_MONEY_SPENT,
        (ctx) => {
            const [
                wholeMessage,
                spenderName, // e.g. '@max'
                amountSpent, // e.g. '25'
                messageCurrency, // e.g. '$'
                excludedMembers, // e.g. '-@mike -@michelle'
                includedMembers, // e.g. '@mark @marie'
            ] = ctx.match as RegExpMatchArray;
            const currency = messageCurrency || Storage.storage.defaultCurrency;
            const message = ctx.message;
            const chatId = message?.chat.id;
            const senderUsername = message?.from?.username;
            verifyCtxFields({chatId, senderUsername}, ctx);

            // extract chat
            const chats = Storage.storage.chats;
            let chat = chats[String(chatId)];
            if (!chat) {
                chat = {partyMembers: []};
                chats[String(chatId)] = chat;
            }

            // extract spender
            // TODO trim "via regexp"; fix regexp groups to not include space
            const spenderUsername = spenderName?.trim() || senderUsername as string;
            let spender = chat.partyMembers.find(member => member.username === spenderUsername);
            if (!spender) {
                spender = {
                    username: spenderUsername,
                    totalSpent: {[currency]: 0},
                    totalOwed: {},
                    shares: 1,
                };
                chat.partyMembers.push(spender);
            }

            // validate excludedMembers and includedMembers
            if (excludedMembers && includedMembers) {
                Logger.error('Message can not contain both excluded and included members!', {
                    excludedMembers,
                    includedMembers
                });
                throw new Error('Message can not contain both excluded and included members!')
                // TODO message in chat that it's tricky edgecase that can not be processed by bot.
            }

            // apply totalSpent
            let spenderTotalSpent = spender.totalSpent;
            spenderTotalSpent[currency] = (spenderTotalSpent[currency] || 0) + Number(amountSpent);

            // apply totalOwe

            // let partyMember = Storage.storage.partyMembers.find(member => member.username === username);
            // if (!partyMember) {
            //     partyMember = {
            //         name: message.from.first_name,
            //         username,
            //         shares: 0,
            //         totalSpent: 0,
            //     };
            //     Storage.storage.partyMembers.push(partyMember);
            // }
            // partyMember.totalSpent += Number(spentAmountArray[0]);
            // writeJson(storageDir, Storage.storage)
            //     .then(() => {
            //         ctx.api.sendChatAction(message.chat.id, 'typing');
            //         Logger.info('Successfully saved money spent info!');
            //     })
            //     .catch(error => Logger.error('Could not write to storage file.', {error}));
        },
        regexpCommand
    );
};
