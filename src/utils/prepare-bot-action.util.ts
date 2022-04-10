import chalk from 'chalk';
import {CommandHandler, BotAction} from '@models';
import {Logger, Localizer, getRedErrorMessage} from '@utils';
import {BotCommandsKeys} from '@constants';

/**
 * Wraps bot command and command handler into Bot Action. Logs command name.
 * @param command - BotCommandKey to load command from localization file.
 * @param commandHandler - bot command handler.
 * @param commandRegExp - command regexp to use instead command from localization file.
 * @throws exception if command extraction from localizer goes wrong.
 */
export const prepareBotAction = (
    command: BotCommandsKeys,
    commandHandler: CommandHandler,
    commandRegExp?: RegExp,
): BotAction | never =>
    [
        commandRegExp || Localizer.command(command),
        ctx => {
            Logger.command('Hearing', chalk.bgBlue(command), 'command!');
            try {
                commandHandler(ctx);
            } catch (error) {
                Logger.error(`Something went wrong while processing ${chalk.bgRed(command)} command!`, getRedErrorMessage(error));
            }
        },
    ];
