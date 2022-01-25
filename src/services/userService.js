const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const sequelize = require("../config/database");
const models = sequelize.models;

exports.getUserByUserId = (userId) => {
    logger.info("getUserByUserId running");
    //get a user with the userId provided
    return new Promise(async (res, rej) => {
        try {
            const result = await models.User.findByPk(userId);
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getUserByUserId

exports.getIfNotCreateUser = (userData) => {
    logger.info("getIfNotCreateUser running");
    //check if there is a user with the provided userId, if there isnt create one with the id and user data
    return new Promise(async (res, rej) => {
        try {
            const [user, created] = await models.User.findOrCreate({
                where: { userId: userData.userId },
                defaults: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    roleId: userData.roleId,
                    profileImage: userData.profileImage
                }
            });
            res(user);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getIfNotCreateUser

exports.updateUserById = (userId, userData) => {
    logger.info("updateUserById running");
    return new Promise(async (res, rej) => {
        try {
            const user = await models.User.update(userData, {
                where: { userId: userId }
            });
            res(user);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of updateUserById

