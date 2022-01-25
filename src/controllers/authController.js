const { ApplicationError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const userService = require("../services/userService");

exports.updateUserProfile = async (req, res, next) => {
    logger.info("updateUserProfile running");
    const userData = req.body.userData;
    const userId = req.params.u_id;
    let errorMsg = "";
    try {        
        const user = await userService.getUserByUserId(userId);
        if (user == null) {
            errorMsg = "User does not exist.";
            throw new ApplicationError(`User does not exist: {userId: ${userId}}`);
        }
        const results = await userService.updateUserById(userId, userData);
        if (results) {
            logger.info(`Successfully updated user: {userId: ${userId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    userId: userId
                },
                "message": null 
            }); 
        }
    } catch (error) { //change error handling to add database error check later
        next(new ApplicationError(error.message));
        if (errorMsg === "") errorMsg = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errorMsg
        });
    }
}; //End of updateUserProfile

exports.getUserQuestionAndReplyCounts = async (req, res, next) => {
    logger.info("getUserQuestionAndReplyCounts running");
    const userId = req.params.u_id;
    let errorMsg = "";
    try {        
        const user = await userService.getUserByUserId(userId);
        if (user == null) {
            errorMsg = "User does not exist.";
            throw new ApplicationError(`User does not exist: {userId: ${userId}}`);
        }
        const results = await userService.getUserQuestionAndReplyCounts(userId, user.roleId==1, true);
        if (results) {
            logger.info(`Successfully updated user: {userId: ${userId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    counts: results
                },
                "message": null 
            }); 
        }
    } catch (error) { //change error handling to add database error check later
        next(new ApplicationError(error.message));
        if (errorMsg === "") errorMsg = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errorMsg
        });
    }
}; //End of getUserQuestionAndReplyCounts