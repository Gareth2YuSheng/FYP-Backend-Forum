const winston = require("winston");
const { createLogger, format, transports, exitOnError } = require("winston");
const { combine, timestamp, printf } = format;
require("winston-daily-rotate-file");

const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
    let msg = `${timestamp} [${level}] : ${message} `;
    if(metadata) { msg += JSON.stringify(metadata); }
    return msg;
});

const rotatingInfoTransport = new transports.DailyRotateFile({
    filename: "logs/info-%DATE%.log",
    datePattern: "YYYY-MM",
    zippedArchive: true,
    maxSize: "20m",
    level: "info",
    json: true
});

const rotatingErrorTransport = new transports.DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM",
    zippedArchive: true,
    maxSize: "20m",
    level: "error",
    json: true
});

const rotatingRequestsTransport = new transports.DailyRotateFile({
    filename: "logs/request-%DATE%.log",
    datePattern: "YYYY-MM",
    zippedArchive: true,
    maxSize: "20m",
    json: true
});

const logger = createLogger({
    format: combine(
    timestamp(),
    myFormat
    ),
    transports: [
        new transports.Console(),
        // new transports.File({ filename: "logs/error.log", level: "error", json: true }),
        // new transports.File({ filename: "logs/info.log", level: "info", json: true }),
        rotatingErrorTransport,
        rotatingInfoTransport
    ]
});

const requestLogger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        // new transports.File({ filename: "logs/request.log", json: true }),
        rotatingRequestsTransport
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