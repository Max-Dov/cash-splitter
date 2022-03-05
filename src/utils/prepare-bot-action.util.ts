import {CommandHandler} from '../models/command-handler.model';
import {BotAction} from '../models/bot-action.model';
import {Logger} from './logger.util';
import chalk from 'chalk';
import {BotCommandsKeys} from '../constants/bot-commands-keys.enum';
import {Localizer} from './localizer.util';

/**
 * Wraps bot command and command handler into Bot Action. Logs command name.
 */
export const prepareBotAction = (command: BotCommandsKeys, commandHandler: CommandHandler): BotAction =>
    [
        Localizer.command(command),
        ctx => {
            Logger.command('Hearing', chalk.bgBlue(command), 'command!');
            try {
                commandHandler(ctx);
            } catch (error) {
                Logger.error(`Something went wrong while processing ${chalk.bgRed(command)} command!`, error);
            }
        },
    ];
