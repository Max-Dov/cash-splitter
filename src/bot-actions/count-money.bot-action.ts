import {resolvePartyCashback} from '../utils/money-splitting.utils';
import {Storage} from '../utils/storage.util';
import {Localizer} from '../utils/localizer.util';
import {BotMessagesKeys} from '../constants/bot-messages-keys.enum';
import {BotCommandsKeys} from '../constants/bot-commands-keys.enum';
import {MemberCashback} from '../models/member-cashback.model';
import {prepareBotAction} from '../utils/prepare-bot-action.util';
import {BotAction} from '../models/bot-action.model';

/**
 * Figure out cashback and cashin for everyone and send that in chat.
 * TODO add ability to remove old messages by button
 */
export const countMoneyBotActionCreator = (): BotAction => prepareBotAction(
    BotCommandsKeys.COUNT_MONEY,
    ctx => {
        // ctx.reply(Localizer.message(BotMessagesKeys.COUNT_MONEY_RESPONSE))
        //     .then(() => {
        //         const partyCashback = resolvePartyCashback(Storage.storage.partyMembers)
        //             .map(prepareSentenceFromCashback)
        //             .join('\n');
        //         const replyMessage = Localizer.message(BotMessagesKeys.COUNT_MONEY_RESULTS, {partyCashback});
        //         ctx.reply(replyMessage)
        //             .catch((error) => {
        //                 throw Error(error);
        //             });
        //     })
        //     .catch((error) => {
        //         throw Error(error);
        //     });
    },
);

/**
 * Prepares member cashback message to display.
 * @param name - member display name
 * @param cashback - cashback from party
 * @param cashin - money amount to return to party
 */
const prepareSentenceFromCashback = ({name, cashback, cashin}: MemberCashback): string => {
    // const isGettingCashback = cashback >= cashin;
    // const preciseCash = Math.abs(cashback - cashin);
    // const cash = Math.trunc(preciseCash * 100) / 100;
    // if (cash === 0) {
    //     return Localizer.message(BotMessagesKeys.USERNAME_IS_EVEN_WITH_EVERYONE, {username: name});
    // }
    // return isGettingCashback
    //     ? Localizer.message(BotMessagesKeys.USERNAME_GETS_CASHBACK_FROM_GROUP, {
    //         username: name,
    //         cashback: cash,
    //     })
    //     : Localizer.message(BotMessagesKeys.USERNAME_SHOULD_PAY_TO_GROUP, {
    //         username: name,
    //         cashin: cash,
    //     });
    return 'nothin!'
};
