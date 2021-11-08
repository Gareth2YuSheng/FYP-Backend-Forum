const { ApplicationError, DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const userService = require("../services/userService");
const postService = require("../services/postService");
const replyService = require("../services/replyService");

exports.getForumQuestionReplies = async (req, res, next) => {
    logger.info("getForumQuestionReplies running");
    const questionId = req.params.q_id;
    const { count, page } = req.query;
    try {        
        // const results = await replyService.getReply
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
}; //End of getForumQuestionReplies

exports.createForumReply = async (req, res, next) => {
    logger.info("createForumReply running");
    const questionId = req.params.q_id;
    const userData = req.body.userData;
    const replyData = req.body.replyData;
    try {        
        //Make sure there is a user with the userId before creating the reply
        //Can remove the check once we start using our own login and register
        const user = await userService.getIfNotCreateUser(userData);
        //Make sure there is a post with the postId before creating the reply
        // const post = await postService.getPosts(postData);
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        //Create the Reply
        const results = await replyService.createReply(
            replyData.replyContent,
            user.userId, //userId to later be retrieved from JWT token
            questionId);
        if (results) {
            logger.info(`Successfully created reply: {replyId: ${results.replyId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    replyId: results.replyId
                },
                "message": "Reply Posted Successfully." 
            });
        }
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
}; //End of createForumReply

exports.upvoteForumReply = async (req, res, next) => {
    logger.info("upvoteForumReply running");
    const replyId = req.params.r_id;
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
}; //End of upvoteForumReply

exports.downvoteForumReply = async (req, res, next) => {
    logger.info("downvoteForumReply running");
    const replyId = req.params.r_id;
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
}; //End of downvoteForumReply

exports.editForumReply = async (req, res, next) => {
    logger.info("editForumReply running");
    const replyId = req.params.r_id;
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
}; //End of editForumReply

exports.markForumReplyAsCorrectAnswer = async (req, res, next) => {
    logger.info("markForumReplyAsCorrectAnswer running");
    const replyId = req.params.r_id;
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
}; //End of markForumReplyAsCorrectAnswer