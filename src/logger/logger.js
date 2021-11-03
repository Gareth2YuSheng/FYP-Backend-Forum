const { createLogger, format, transports, exitOnError } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if(metadata) { msg += JSON.stringify(metadata); }
  return msg;
});

const logger = createLogger({
  format: combine(
	timestamp(),
	myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error", json: true }),
    new transports.File({ filename: "logs/info.log", level: "info", json: true }),
  ]
});

const requestLogger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: "logs/request.log", json: true }),
  ],
  exitOnError: false,
});

requestLogger.stream = {
  write: function(message, encoding) {
    logger.info(message);
    requestLogger.info(message);
  },
};

module.exports = {
  logger,
  requestLogger,
};