import {CommandHandler} from '../models/command-handler.model';
import {BotAction} from '../models/bot-action.model';
import {Logger} from './logger.util';
import chalk from 'chalk';
import {BotCommandsKeys} from '../constants/bot-commands-keys.enum';
import {Localizer} from './localizer.util';

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
                Logger.error(`Something went wrong while processing ${chalk.bgRed(command)} command!`, error);
            }
        },
    ];
