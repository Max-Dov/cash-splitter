import {CommandHandler} from '../models/command-handler.model';
import {Logger} from './logger.util';
import chalk, {bgRed} from 'chalk';
import {ChatCommands} from '../constants/chat-commands.enum';
import {BotCommandAction} from '../models/bot-command-action.model';

/**
 * Wraps bot command and command handler into Bo Command Action. Logs command name.
 * @param command - ChatCommands value to react to.
 * @param commandHandler - bot command handler.
 */
export const prepareBotCommandAction = (
    command: ChatCommands,
    commandHandler: CommandHandler,
): BotCommandAction =>
    [
        command,
        ctx => {
            Logger.command(chalk.bgBlue(command), 'command was called!');
            try {
                commandHandler(ctx);
            } catch (error) {
                Logger.error(
                    `Something went wrong while processing ${chalk.bgRed(command)} chat command!`,
                    bgRed((error as Error).message),
                );
            }
        },
    ];
