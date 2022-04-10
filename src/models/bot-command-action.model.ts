import {CommandHandler} from '@models';
import {ChatCommands} from '@constants';

/**
 * <Command, CommandHandler> pair wrapped in tuple. Expected to be passed as arguments to Bot.command.
 */
export type BotCommandAction = [ChatCommands, CommandHandler];
