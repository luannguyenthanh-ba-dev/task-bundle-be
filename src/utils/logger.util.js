const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(
  ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`
);

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
});

const requestAPILogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

module.exports = { logger, requestAPILogger };
