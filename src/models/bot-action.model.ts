import {CommandHandler} from '@models';

/**
 * <Command, CommandHandler> pair wrapped in tuple. Expected to be passed as arguments to Bot.hears.
 */
export type BotAction = [RegExp, CommandHandler];
