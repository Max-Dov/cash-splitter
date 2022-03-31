import {pathExists, readJson} from 'fs-extra';
import {Logger} from './logger.util';
import chalk from 'chalk';

/**
 * Provides static methods to utilize localisation strings.
 */
export class Localizer {
    private static localizationData: LocalizationData | null;

    /**
     * Loads localization file into Localizer. Expected to be called only once in the app.
     * @param filePath - file path containing localizations
     */
    static loadLocalization = (filePath: string): Promise<void> =>
        pathExists(filePath).then(exists => {
            if (exists) {
                return readJson(filePath).then(localizationData => Localizer.localizationData = localizationData);
            } else {
                return Promise.reject(`Could not read localization file! ${chalk.bgRed(filePath)}`);
            }
        });

    /**
     * Loads message string from localization file by its key. Fills placeholders with proper strings.
     * @param messageKey - string key from localization file; e.g. "SET_SHARE_RESPONSE"
     * @param placeholders - object with placeholders replacement strings; e.g. {username: 'Max', share: 5}
     * @throws Error if message does not exist in localization file.
     */
    static message = (
        messageKey: string,
        placeholders?: { [key in string]: string | number },
    ): string => {
        const message = Localizer.localizationData?.messages[messageKey];
        if (!message) {
            Logger.error('Could not find message in localizationData!', chalk.bgRed({message}));
            throw Error('Could not find message in localizationData!')
        }
        return placeholders
            ? Localizer.replacePlaceholders(message, placeholders)
            : message;
    };

    /**
     * Loads bot command regexp from localization file by its key.
     * @param commandKey - string key from localization file; e.g. "SET_SHARE"
     * @throws Error if command does not exist in localization file.
     */
    static command = (commandKey: string): RegExp => {
        const command = Localizer.localizationData?.commands[commandKey];
        if (!command) {
            Logger.error('Could not find command in localizationData!', {commandKey});
            throw Error('Could not find command in localizationData!')
        }
        return new RegExp(command, 'i');
    };

    /**
     * Replaces placeholders within string with actual values. E.g. '{name} joined' -> 'Max joined'.
     * @param message - string with placeholders
     * @param placeholders - object with placeholders replacement strings; e.g. {username: 'Max', share: 5}
     */
    static replacePlaceholders = (
        message: string,
        placeholders: { [key in string]: string | number }
    ): string =>
        Object.keys(placeholders).reduce(
            (resultMessage, placeholder) =>
                resultMessage.replace(`{${placeholder}}`, String(placeholders[placeholder])),
            message,
        )
}

/**
 * Localisation file format.
 */
interface LocalizationData {
    commands: {
        [key in string]: string
    };
    messages: {
        [key in string]: string
    };
}