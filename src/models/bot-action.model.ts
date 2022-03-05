import {CommandHandler} from './command-handler.model';

/**
 * <Command, CommandHandler> pair wrapped in tuple. Expected to be passed as arguments to Bot.hears.
 */
export type BotAction = [RegExp, CommandHandler];
