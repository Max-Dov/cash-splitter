import {Context} from 'grammy';
import {Party} from '@models';
import {getPartyPayouts, getRedErrorMessage, Localizer, Logger} from '@utils';
import {BotMessagesKeys} from '@constants';

/**
 * Updates summary message with relevant info on cashbacks.
 */
export const refreshSummaryMessage = (ctx: Context, party: Party): void => {
    const summaryMessageId = party.summaryMessageId;
    if (!summaryMessageId) return;
    const summaryMessage = Localizer.message(BotMessagesKeys.SUMMARY_MESSAGE, {
        summary: getPartyPayouts(party, false),
        date: new Date().toDateString(),
    });
    ctx.api.editMessageText(party.chatId, summaryMessageId, summaryMessage)
        .then(() => Logger.info('Successfully updated summary message!'))
        .catch((error) => {
            Logger.error('Could not update summary message!', getRedErrorMessage(error));
            throw new Error('Could not update summary message!');
        });
};