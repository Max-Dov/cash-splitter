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

    static info = (...messages: any[]) => console.log(
        chalk.bold(LogTypes.INFO),
        Logger.timeNow(),
        ...messages,
    );

    static error = (...messages: any[]) => console.log(
        chalk.bold.red(LogTypes.ERROR),
        Logger.timeNow(),
        ...messages,
    );
}

enum LogTypes {
    INFO = 'INFO',
    ERROR = 'ERROR'
}