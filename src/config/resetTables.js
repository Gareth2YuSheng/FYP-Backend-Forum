const { logger } = require("../logger/logger");
const { DatabaseError } = require("../errors/errors");

//Require DB instance
const sequelize = require("./database");
const models = sequelize.models;

async function resetTables() {
    //Test DB connection
    await sequelize.testConnection();
    //Create the tables
    await sequelize.sync({ force: true })
        .then(result => {
            logger.info("Reset DB Tables successfully");
        }).catch(error => {
            logger.error("", new DatabaseError(error.message));
        });
    // //Insert the Roles: Student, tutor, parent
    models.Role.create({
        roleName: "STUDENT"
    });
    models.Role.create({
        roleName: "TUTOR"
    });
    models.Role.create({
        roleName: "PARENT"
    });
}

resetTables();