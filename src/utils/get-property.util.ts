import {Logger} from './logger.util';

/**
 * Gets specified property from object. Throws error if no property found.
 * TODO is that util even needed in an app?
 * TODO implement better signature (e.g. https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object)
 * @param object
 * @param keys
 * @param shouldThrowIfNotFound
 */
export const getProperty = <T = any>(
    object: any,
    keys: string[] | string,
    shouldThrowIfNotFound: boolean = true
): T | never => {
    if (typeof keys === 'string') {
        const field = object?.[keys];
        if (field === undefined && shouldThrowIfNotFound) {
            Logger.error('Could not get required field from an object!', {keys, object});
            throw Error('Could not get required field from an object!');
        } else {
            return field;
        }
    }
    return keys.reduce((objectOrField, propertyName) => {
        const field = objectOrField?.[propertyName];
        if (field === undefined && shouldThrowIfNotFound) {
            Logger.error('Could not get required field from an object!', {keys, object});
            throw Error('Could not get required field from an object!');
        } else {
            return field;
        }
    }, object);
};

/**
 * I like that with getProperty props lookup code can be shortened and can be read by dev faster than longer equivalent.
 * But providing typesafe signature with types inference would slow down TSC and provide no real value to codebase.
 * So for now "logErrorAndThrow" util would be used instead for same purpose.
 */
// export const setShareBotAction = prepareBotAction(
//     Localizer.command(BotCommandsKeys.SET_SHARE),
//     ctx => {
//         const username = getProperty<string>(ctx, ['message', 'from', 'username']);
//         const messageText = getProperty<string>(ctx, ['message', 'text']);
//         const chatId = getProperty<string>(ctx, ['message', 'chat', 'id']);
/**
 * Longer equivalent:
 */
// export const setShareBotAction = prepareBotAction(
//     Localizer.command(BotCommandsKeys.SET_SHARE),
//     ctx => {
//         const message = ctx.message;
//         if (!message) {
//             Logger.error('Could not figure out message from context.', {ctx});
//             return;
//         }
//         const username = message.from?.username;
//         if (!username) {
//             Logger.error('Could not figure out username from message.', {message});
//             return;
//         }
//         const messageText = message.text;
//         if (!messageText) {
//             Logger.error('Could not figure out text from message.', {message});
//             return;
//         }
