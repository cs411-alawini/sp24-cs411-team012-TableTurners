import winston from 'winston';
import 'winston-daily-rotate-file';

const MAX_SIZE = '20m';
const MAX_FILES = 10;

export type Logger = winston.Logger;

/**
 * createLogger()
 * Creates a winston logger with error, warn, info, and debug levels
 * @returns logger
 */
export default function createLogger(): Logger {
  const logLevels = { error: 0, warn: 1, info: 2, debug: 3 };

  const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels: logLevels,
    exitOnError: false,
  });

  // add file transport if a directory is defined
  if (process.env.LOG_DIR && process.env.LOG_DIR !== '') {
    const format = winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
    );
    const info_transport = new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: process.env.LOG_DIR,
      filename: 'Info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: MAX_SIZE,
      maxFiles: MAX_FILES,
      format,
    });

    logger.add(info_transport);
  }

  // Add some colors to console output
  winston.addColors({
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red',
  });
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((i) => `[${i.timestamp}] ${i.level}: ${i.message}`),
      ),
    }),
  );

  return logger;
}
