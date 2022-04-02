import {Context} from 'grammy';
import {Logger} from './logger.util';
import {Message} from '@grammyjs/types';
import TextMessage = Message.TextMessage;

/**
 * Verifies that object consisting of fields from ctx (action handler context) contains no undefined fields;
 * otherwise logs error and throws exception.
 */
export const verifyCtxFields = (objectToVerify: {[key in string]: any | undefined}, ctx: Context | TextMessage): null | never => {
    for (let key in objectToVerify) {
        if (objectToVerify[key] === undefined) {
            Logger.error(
                'Could not figure out necessary fields:',
                objectToVerify,
                'from ctx:',
                ctx,
            )
            throw new Error('Could not figure out necessary fields from context!');
        }
    }
    return null;
}