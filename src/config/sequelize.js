//Setup Sequelize instance
const { Sequelize } = require("sequelize");
const config = require("./config");
const { logger } = require("../logger/logger");
const { DatabaseConnectionError } = require("../errors/errors");

const sequelizeOptions = {
    host: config.rdsHostUrl,
    port: config.rdsPortNum,
    database: config.rdsDBName,
    username: config.rdsDBUsername,
    password: config.rdsDBPassword,
    logging: msg => logger.info(msg),
    maxConcurrentQueries: 100,
    dialect: 'postgres',
    // dialectOptions: {
    //     ssl:'Amazon RDS'
    // },
    pool: { max: 100, idle: 300000 }, //5 mins
    language: 'en'
}

const sequelize = new Sequelize(sequelizeOptions);

sequelize.testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Connection to DB has been established successfully");
    } catch (error) {
        logger.error("", new DatabaseConnectionError(error.message));
    }
}

module.exports = sequelize;
