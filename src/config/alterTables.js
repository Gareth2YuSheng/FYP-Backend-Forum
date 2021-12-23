const { logger } = require("../logger/logger");
const { DatabaseError } = require("../errors/errors");

//Require DB instance
const sequelize = require("./database");
const models = sequelize.models;

async function alterTables() {
    //Test DB connection
    await sequelize.testConnection();
    //Create the tables
    await sequelize.sync({ alter: true })
        .then(result => {
            logger.info("Re-synced DB Tables successfully");
        }).catch(error => {
            logger.error("", new DatabaseError(error.message));
        });
}

alterTables();