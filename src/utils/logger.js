const { transports, format, createLogger } = require('winston');

const { combine, timestamp, prettyPrint, printf } = format;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
});

const consoleTransportFormat = printf(
  ({ level, message, logTimestamp }) => `${logTimestamp} - ${level}: ${message}`
);

logger.add(
  new transports.Console({
    // format: format.combine(format.colorize(), format.simple()),
    format: format.combine(
      format.colorize(),
      combine(timestamp(), consoleTransportFormat)
    ),
    handleExceptions: true,
  })
);

module.exports = logger;
