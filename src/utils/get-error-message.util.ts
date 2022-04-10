import {bgRed, bgRedBright} from 'chalk';

/**
 * Attempts to extract error message and paints background into red.
 * @param error - "try-catch" or "Promise.catch" error.
 */
export const getRedErrorMessage = (error: unknown): string => {
    const message = (error as Error)?.message;
    return message
        ? bgRed(message)
        : bgRedBright('Can not extract Error.message');
};
