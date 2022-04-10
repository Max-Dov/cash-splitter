import {BotAction} from '@models';
import {BotCommandsKeys} from '@constants';
import {prepareBotAction} from '@utils';

/**
 * Set member share to requested value.
 */
export const setShareBotActionCreator = (): BotAction => prepareBotAction(
    BotCommandsKeys.SET_SHARE,
    () => {
    //     const message = ctx.message;
    //     if (!message) {
    //         Logger.error('Could not figure out message from context.', {ctx});
    //         return;
    //     }
    //     const username = message.from?.username;
    //     if (!username) {
    //         Logger.error('Could not figure out username from message.', {message});
    //         return;
    //     }
    //     const messageText = message.text;
    //     if (!messageText) {
    //         Logger.error('Could not figure out text from message.', {message});
    //         return;
    //     }
    //     const shareNumberArray = RegExps.NUMBER_AT_START.exec(messageText);
    //     if (!shareNumberArray) {
    //         Logger.error('Could not figure out share number from messageText.', {messageText});
    //         return;
    //     }
    //     let partyMember = Storage.storage.partyMembers.find(member => member.username === username);
    //     if (!partyMember) {
    //         const name = message.from?.first_name;
    //         if (!name) {
    //             Logger.error('Could not figure out display name from message.', {message});
    //             return;
    //         }
    //         partyMember = {
    //             name,
    //             username,
    //             shares: 0,
    //             totalSpent: 0,
    //         };
    //         Storage.storage.partyMembers.push(partyMember);
    //     }
    //     partyMember.shares = Number(shareNumberArray[0]);
    //     const storageDir = process.env.STORAGE_DIR || './build/storage.json';
    //     writeJson(storageDir, Storage.storage)
    //         .then(() => {
    //             ctx.api.sendChatAction(message.chat.id, 'typing');
    //             ctx.reply(process.env.SET_SHARE_RESPONSE || 'Share is set!');
    //             Logger.info('Successfully saved share info!');
    //         })
    //         .catch(error => Logger.error('Could not write to storage file.', {error}));
    },
);
