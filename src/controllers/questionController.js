const { ApplicationError, DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const forumService = require("../services/forumService");
const userService = require("../services/userService");

exports.getForumQuestions = async (req, res, next) => {
    logger.info("getForumQuestions running");
    const { count, page, subject } = req.query;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error)
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of getForumQuestions

exports.getForumQuestionDetails = async (req, res, next) => {
    logger.info("getForumQuestionDetails running");
    const questionId = req.params.q_id;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error)
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of getForumQuestionDetails

exports.createForumQuestion = async (req, res, next) => {
    logger.info("createForumQuestion running");
    const questionData = req.body.questionData;    
    const userData = req.body.userData; //remove later once login is setup
    try {
        //Make sure there is a user with the userId before creating the post
        //Can remove the check once we start using our own login and register
        const user = await userService.getUserIfNotCreateUser(userData);
        //console.log(user);
        //Create the Post
        const results = await forumService.createPost(
            questionData.questionTitle, 
            questionData.questionContent, 
            user.userId, //userId to later be retrieved from JWT token
            questionData.subjectId, 
            "OPEN");
        if (results) {
            console.log(results)
            return res.status(200).json({  
                "success": true,
                "data": null,
                "message": "Question Posted Successfully." 
            });
        }    
        // return res.status(200).json({  
        //     "success": true,
        //     "data": null,
        //     "message": "Question Posted Successfully." 
        // });  
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error)
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of createForumQuestion

exports.editForumQuestionDetails = async (req, res, next) => {
    logger.info("editForumQuestionDetails running");
    const questionId = req.params.q_id;
    const questionData = req.body;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error)
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of editForumQuestionDetails

exports.deleteForumQuestion = async (req, res, next) => {
    logger.info("deleteForumQuestion running");
    const questionId = req.params.q_id;
    const questionData = req.body;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error)
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of deleteForumQuestion