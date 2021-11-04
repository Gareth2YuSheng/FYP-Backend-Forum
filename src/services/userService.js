const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const User = require("../models/User");

exports.createUser = (firstName, lastName, email, password, roleId, userId=null) => {
    logger.info("createUser running");
    //create user with userId, if userId was provided in the function parameters
    return new Promise(async (res, rej) => {
        try {
            let result;
            if (userId!=null) { //if userId was provided
                result = await User.create({
                    userId: userId,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    roleId: roleId
                });
            } else { //if userId was not provided
                result = await User.create({
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
            const result = await User.findOne({ where: { userId: userId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getUserByUserId

//Only for create post and create reply
exports.getUserIfNotCreateUser = (userData) => {
    logger.info("getUserIfNotCreateUser running");
    //check if there is a user with the provided userId, if there isnt create one with the id and user data
    return new Promise(async (res, rej) => {
        try {
            const user = await this.getUserByUserId(userData.userId);
            //If there is a user return it
            if (user) {
                console.log("Existing user found");
                res(user);
            } else { //if not create a new one with the userId and return it
                console.log("No existing user found");
                const newUser = await this.createUser(userData.firstName, 
                    userData.lastName, 
                    userData.email, 
                    "password", 
                    userData.roleId,
                    userData.userId);
                res(newUser);
            }
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getUserIfNotCreateUser

