import {BotCommandAction} from '../models/bot-command-action.model';
import {prepareBotCommandAction} from '../utils/prepare-bot-command-action.util';
import {ChatCommands} from '../constants/chat-commands.enum';
import {openClearMessagesMenu} from '../utils/clear-messages.menu';

/**
 * Opens "Clean above messages" menu.
 */
export const openClearMessagesMenuBotActionCreator = (): BotCommandAction => prepareBotCommandAction(
    ChatCommands.CLEAN_MESSAGES,
    openClearMessagesMenu
);
