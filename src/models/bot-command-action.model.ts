import {CommandHandler} from './command-handler.model';
import {ChatCommands} from '../constants/chat-commands.enum';

/**
 * <Command, CommandHandler> pair wrapped in tuple. Expected to be passed as arguments to Bot.command.
 */
export type BotCommandAction = [ChatCommands, CommandHandler];
