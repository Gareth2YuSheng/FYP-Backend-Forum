
const { Sequelize } = require("sequelize");
const config = require("./config");

const dbConnectionUrl = config.databaseUrl;

const sequelize = new Sequelize(dbConnectionUrl, {

    logging: msg => logger.debug(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
 
});

module.exports = sequelize;