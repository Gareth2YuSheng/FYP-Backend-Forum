const { ApplicationError, DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const userService = require("../services/userService");
const postService = require("../services/postService");
const replyService = require("../services/replyService");
const PostReply = require("../models/PostReply");

exports.getForumQuestionReplies = async (req, res, next) => {
    logger.info("getForumQuestionReply running");
    const questionId = req.params.q_id;
    const { count, page } = req.query;    
    try { //sanitize results later
        const results = await replyService.getReplies(questionId, count, page);
        if (results) {
            logger.info(`Successfully retrieved replies: {count:${count}, page:${page}} for {postId: ${questionId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    replies: results
                    },
                "message": null 
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
    const replyData = req.body.replyData;
    const userData = req.body.userData;
    try {        
        //Make sure there is a user with the userId before creating the reply
        const user = await userService.getIfNotCreateUser(userData);
        //Check if reply with replyId provided exists
        const reply = await replyService.getReplyById(replyId);
        //If reply does not exist return error
        if (reply == null) {
            next(new ApplicationError(`Reply does not exist: {replyId: ${replyId}}`));
            return res.status(500).json({
                "success": false,
                "data": null,
                "message": "Reply does not exist."
            });
        }
        // Check if user is author of the postReply
        if (userData.userId != reply.userId) {
            next(new ApplicationError(`Unauthorized Reply Edit Attempt: Unauthorized Reply Edit by {userId: ${userData.userId}} on {replyId: ${reply.replyId}}`));
            return res.status(500).json({ 
                "success": false,
                "data": null,
                "message": "Unauthorized User." 
            });
        }
        //Update reply data
        const results = await replyService.editForumReply(
            replyData.replyContent,
            user.userId,
            reply);
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        if (results) {
            logger.info(`Successfully updated reply: {replyId: ${results.replyId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    replyId: results.replyId
                },
                "message": "Reply Updated Successfully."
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
}; //End of editForumReply

exports.markForumReplyAsCorrectAnswer = async (req, res, next) => {
    logger.info("markForumReplyAsCorrectAnswer running");
    const replyId = req.params.r_id;
    const replyData = req.body.replyData;
    const userData = req.body.userData;
    try {        
        //Make sure there is a user with the userId before making answer as correct
        const user = await userService.getIfNotCreateUser(userData);
        // Check if reply with replyId provided exists
        const reply = await replyService.getReplyById(replyId);
        //Check if post with questionId exist
        const post = await postService.getPostById(reply.parentId);
        //If reply does not exist return error
        if (reply == null) {
            next(new ApplicationError(`Reply does not exist: {replyId: ${replyId}}`));
            return res.status(500).json({
                "success": false,
                "data": null,
                "message": "Reply does not exist."
            });
        }
        // Check if user is author of the post
        if (userData.userId != post.userId) {
            next(new ApplicationError(`Unauthorized Edit Attempt: Unauthorized Mark Answer Reply Edit by {userId: ${userData.userId}} on {postId: ${questionId.questionId}}`));
            return res.status(500).json({ 
                "success": false,
                "data": null,
                "message": "Unauthorized User." 
            });
        }
        //Update reply answer as correct
        replyData.isAnswer = (replyData.isAnswer === "true") ? true : false;
        const results = await replyService.markForumReplyAsCorrectAnswer(replyData.isAnswer, reply);
        if (results) {
            logger.info(`Successfully updated reply answer as correct: ${results.replyId}`);
            return res.status(200).json({
                "success": true,
                "data": {
                    replyId: results.replyId
                },
                "message": "Reply Marked Updated Successfully"
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
}; //End of markForumReplyAsCorrectAnswer