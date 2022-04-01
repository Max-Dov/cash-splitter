import chalk from 'chalk';

/**
 * Simple logger that adds log type and date to log messages.
 */
export class Logger {
    /**
     * Checks if number < 10, then appends '0' in front.
     * @param number
     */
    private static check0 = (number: number): string =>
        (number < 10 ? '0' : '') + number;

    /**
     * Returns current time in "HH:MM:SS.MS" format.
     */
    private static timeNow = (): string => {
        const time = new Date();
        const format = 'HH:MM:SS.MS';
        return format
            .replace('HH', Logger.check0(time.getHours()))
            .replace('MM', Logger.check0(time.getMinutes()))
            .replace('SS', Logger.check0(time.getSeconds()))
            .replace('MS', time.getMilliseconds().toString());
    };

    static info = (...messages: any[]) => console.info(
        chalk.bold(LogTypes.INFO),
        chalk.bgGray(Logger.timeNow()),
        ...messages,
    );

    /**
     * Prints info message in green for morale boost.
     * Expected use case is "success checkpoints", like processing split cash command.
     */
    static goodInfo = (...messages: any[]) => console.info(
        chalk.bold.bgGreen(LogTypes.INFO),
        chalk.bgGray(Logger.timeNow()),
        ...messages,
    );

    static error = (...messages: any[]) => console.error(
        chalk.bold.bgRed(LogTypes.ERROR),
        chalk.bgGray(Logger.timeNow()),
        ...messages,
    );

    static warning = (...messages: any[]) => console.warn(
        chalk.bold.bgYellow(LogTypes.WARNING),
        chalk.bgGray(Logger.timeNow()),
        ...messages,
    );

    static command = (...messages: any[]) => console.log(
        chalk.bold.bgBlue(LogTypes.COMMAND),
        chalk.bgGray(Logger.timeNow()),
        ...messages,
    );
}

enum LogTypes {
    INFO = 'INFO',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    COMMAND = 'COMMAND'
}