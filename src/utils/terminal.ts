import moment from 'moment';
import c from './ansi-colors.js';

export const LogLevel = {
    debug: `${c.cyan}[DEBUG]${c.reset}`,
    info: `${c.green}[INFO]${c.reset}`,
    warning: `${c.yellow}[WARNING]${c.reset}`,
    error: `${c.red}[ERROR]${c.reset}`,
};

export class Terminal {
    private readonly origin: string;

    constructor(origin) {
        this.origin = `${c.yellow}[${origin}]${c.reset}`;
    }

    log(level, message) {
        const hour = `${c.red}[${moment()
            .format('HH:mm:ss')}]${c.reset}`;
        // eslint-disable-next-line no-console
        console.log(`${hour} ${this.origin} ${level}`, message, `${c.reset}`);
    }

    debug(message) {
        this.log(LogLevel.debug, message);
    }

    info(message) {
        this.log(LogLevel.info, message);
    }

    warning(message) {
        this.log(LogLevel.warning, message);
    }

    error(message) {
        this.log(LogLevel.error, message);
    }
}