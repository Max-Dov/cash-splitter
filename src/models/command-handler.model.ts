import {Context} from 'grammy';

/**
 * Bot command handler. Throws errors if something goes wrong.
 */
export type CommandHandler = (ctx: Context) => void | never;
