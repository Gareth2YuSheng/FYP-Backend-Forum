const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const sequelize = require("../config/database");
const models = sequelize.models;

exports.createUser = (firstName, lastName, email, password, roleId, userId=null) => {
    logger.info("createUser running");
    //create user with userId, if userId was provided in the function parameters
    return new Promise(async (res, rej) => {
        try {
            let result;
            if (userId) { //if userId was provided
                result = await models.User.create({
                    userId: userId,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    roleId: roleId
                });
            } else { //if userId was not provided
                result = await models.User.create({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    roleId: roleId
                });
            }            
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of createUser

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

//Only for create post and create reply 
exports.getIfNotCreateUser = (userData) => {
    logger.info("getIfNotCreateUser running");
    //check if there is a user with the provided userId, if there isnt create one with the id and user data
    return new Promise(async (res, rej) => {
        try {
            const [user, created] = await models.User.findOrCreate({
                where: { userId: userData.userId },
                defaults: {
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    password: "password",
                    roleId: userData.roleId
                }
            });
            res(user);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getIfNotCreateUser

