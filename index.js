const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
//const config = require('./src/config/config');

const { logger, requestLogger } = require("./src/logger/logger");
const { ApplicationError } = require("./src/errors/errors");

const app = express();

//CORS
// const whitelist = ['https://localhost:3001', 'https://localhost:3002'];
// const corsOptionsDelegate = (req, callback) => {
//     console.log(req.header('Origin'))
//     let corsOptions;
//     let isDomainAllowed = whitelist.indexOf(req.header('Origin')) !== -1;
//     if (isDomainAllowed) corsOptions = { origin: true }
//     else { 
//         corsOptions = { origin: false } 
//         logger.error("Attempted Access from non-whitelisted domain",{domain:req.header('Origin')});
//     }
//     callback(null, corsOptions);
// }
// app.use(cors(corsOptionsDelegate));
app.use("*", cors()); //* for testing

//log requests here
app.use(morgan("combined", { stream: requestLogger.stream }));

//Server Settings
const PORT = (process.env.PORT || 5000);
const bootstrap = require("./src/bootstrap");

//Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Express Router
const router = express.Router();
app.use(router);
bootstrap(app, router);


router.use((err, req, res, next) => {
    if (!(err instanceof ApplicationError)) {
        next(err);
    } 
    //log error here
    logger.error("", err);
});


process.on("unhandledRejection", (reason, promise) => {
    throw reason;
});

process.on("uncaughtException", function(error, origin) {
    //Handle the error safely. 
    //Developer note: As long as you have callback hell, the error handling code
    //will break. This often occurs during team development.
    //Key reference: https://www.toptal.com/nodejs/node-js-error-handling
    //log error here
    logger.error("", error);
    if (!(error instanceof ApplicationError)) {
        process.exit(1); //combine with a automatic restarter like PM2 to immediately restart app gracefully
    } 
});


app.listen(PORT, err => {
    if (err) return logger.error(`Cannot Listen on PORT: ${PORT}`);
    logger.info(`Server is Listening on: http://localhost:${PORT}/`);
});
