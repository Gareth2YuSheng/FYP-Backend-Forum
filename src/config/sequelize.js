//Setup Sequelize instance
const { Sequelize } = require("sequelize");
const config = require("./config");
const { logger } = require("../logger/logger");
const { DatabaseConnectionError } = require("../errors/errors");

const dbConnectionUrl = config.databaseUrl;

const sequelize = new Sequelize(dbConnectionUrl, {
    logging: msg => logger.info(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
});

sequelize.testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Connection to DB has been established successfully");
    } catch (error) {
        logger.error("", new DatabaseConnectionError(error.message));
    }
}

module.exports = sequelize;
