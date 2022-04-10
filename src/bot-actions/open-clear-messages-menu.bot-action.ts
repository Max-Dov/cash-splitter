import {BotCommandAction} from '@models';
import {openClearMessagesMenu, prepareBotCommandAction} from '@utils';
import {ChatCommands} from '@constants';

/**
 * Opens "Clean above messages" menu.
 */
export const openClearMessagesMenuBotActionCreator = (): BotCommandAction => prepareBotCommandAction(
    ChatCommands.CLEAN_MESSAGES,
    openClearMessagesMenu
);
