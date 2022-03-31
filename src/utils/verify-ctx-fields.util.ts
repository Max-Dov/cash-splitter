import {Context} from 'grammy';
import chalk from 'chalk';
import {Logger} from './logger.util';

/**
 * Verifies that object consisting of fields from ctx (action handler context) contains no undefined fields;
 * otherwise logs error and throws exception.
 */
export const verifyCtxFields = (objectToVerify: {[key in string]: any | undefined}, ctx: Context): null | never => {
    for (let key in objectToVerify) {
        if (objectToVerify[key] === undefined) {
            Logger.error(
                'Could not figure out necessary fields:',
                chalk.bgYellow(objectToVerify),
                'from ctx:',
                chalk.bgRed(ctx),
            )
            throw new Error('Could not figure out necessary fields from context!');
        }
    }
    return null;
}