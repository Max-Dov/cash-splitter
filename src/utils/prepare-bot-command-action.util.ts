import chalk, {bgRed} from 'chalk';
import {Logger} from '@utils';
import {ChatCommands} from '@constants';
import {BotCommandAction, CommandHandler} from '@models';

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
