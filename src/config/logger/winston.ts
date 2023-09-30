import chalk from 'chalk';
import winston, { format, transports } from 'winston';

import { Logger } from './logger';

export class WinstonLoggerAdapter implements Logger {
  private readonly logger: winston.Logger;

  constructor(private readonly method: string) {
    const isTestEnv = process.env.NODE_ENV === 'test';

    this.logger = winston.createLogger({
      level: isTestEnv ? 'silent' : 'info',
      defaultMeta: method,
      format: format.combine(
        format.simple(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => {
          let message = `[${info.timestamp}] [${info.level}] ${info.message}`;

          switch (info.level) {
            case 'error':
              message = chalk.red(message);
              break;
            case 'warn':
              message = chalk.yellow(message);
              break;
            case 'info':
              message = chalk.green(message);
              break;
            default:
              message = chalk.white(message);
              break;
          }

          return message;
        })
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: './.logs/combined.log',
        }),
        new transports.File({
          filename: './.logs/error.log',
          level: 'error',
        }),
      ],
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }
}
