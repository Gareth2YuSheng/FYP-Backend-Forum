const { ApplicationError, DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const userService = require("../services/userService");
const postService = require("../services/postService");
const replyService = require("../services/replyService");

exports.getForumQuestionReplies = async (req, res, next) => {
    logger.info("getForumQuestionReply running");
    const questionId = req.params.q_id;
    const { count, page, userId } = req.query;    
    try { //sanitize results later
        const replyCount = await replyService.getReplyCountForQuestion(questionId);
        let replies = null;
        if (replyCount > 0) {
            replies = await replyService.getReplies(questionId, count, page, userId);
        } 
        //return response regardless of if there are replies or not
        logger.info(`Successfully retrieved replies: {count:${count}, page:${page}} for {postId: ${questionId}} with {replyCount: ${replyCount}}`);
        return res.status(200).json({  
            "success": true,
            "data": {
                replyCount: replyCount,
                replies
            },
            "message": null 
        });        
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
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
        let errMsg = "Server is unable to process the request.";
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else {
            if (error.message === "insert or update on table \"postReply\" violates foreign key constraint \"postReply_parentId_fkey\"") {
                errMsg = "Post does not exist.";
            }
            next(error);
        } 
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errMsg 
        });
    }
}; //End of createForumReply

exports.voteForumReply = async (req, res, next) => {
    logger.info("voteForumReply running");
    const replyId = req.params.r_id;
    const userData = req.body.userData;
    const voteData = req.body.voteData;
    voteData.type = voteData.type === "up";
    try {        
        //Make sure there is a user with the userId before upvoting reply
        const user = await userService.getIfNotCreateUser(userData);
        //check if user has voted on this reply before
        const vote = await replyService.checkForVoteForReply(userData.userId, replyId);
        //if vote exists and is the same type return
        if (vote && vote.type == voteData.type) {
            logger.info(`Vote: {voteId: ${vote.voteId}} for {replyId: ${replyId}} by {userId: ${userData.userId}} already exists`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    voteId: vote.voteId
                },
                "message": "User has already voted on this reply."
            });
        } 
        //else if vote exists but is a different type change it
        else if (vote && vote.type != voteData.type) {
            const results = await replyService.changeVoteType(vote, voteData.type);
            if (results) {
                logger.info(`Vote: {voteId: ${vote.voteId}} for {replyId: ${replyId}} by {userId: ${userData.userId}} has been changed to {type: ${voteData.type}}`);
                return res.status(200).json({  
                    "success": true,
                    "data": {
                        voteId: vote.voteId
                    },
                    "message": "User vote has been updated."
                });
            }            
        } 
        //else if vote doesnt exist create it
        else {
            //Create vote record and update reply voteCount
            const results = await replyService.voteForumReply(
                user.userId,
                replyId,
                voteData.type);
            if (results) {
                logger.info(`Successfully created vote: {voteId: ${results.voteId}} for {replyId: ${replyId}}`);
                return res.status(200).json({  
                    "success": true,
                    "data": {
                        voteId: results.voteId
                    },
                    "message": "Vote Created Successfully."
                });
            }
        }
    } catch (error) {
        let errMsg = "Server is unable to process the request.";
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else {
            if (error.message === "insert or update on table \"vote\" violates foreign key constraint \"vote_replyId_fkey\"") {
                errMsg = "Reply does not exist.";
            }
            next(error);
        } 
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errMsg
        });
    }
}; //End of voteForumReply

exports.deleteForumReplyVote = async (req, res, next) => {
    logger.info("deleteForumReplyVote running");
    const replyId = req.params.r_id;
    const userData = req.body.userData;
    try {        
        //Make sure there is a user with the userId before unvoting reply
        // const user = await userService.getIfNotCreateUser(userData);
        //check if user has voted on this reply before
        const vote = await replyService.checkForVoteForReply(userData.userId, replyId);
        if (vote == null) {
            next(new ApplicationError(`Vote by {userId: ${userData.userId}} does not exist for {replyId: ${replyId}}`));
            return res.status(500).json({
                "success": false,
                "data": null,
                "message": "Vote does not exist."
            });
        }
        const results = await replyService.unvoteForumReply(vote, replyId);
        if (results) {
            logger.info(`Successfully deleted vote: {voteId: ${vote.voteId}} for {replyId: ${replyId}}`);
            return res.status(200).json({  
                "success": true,
                "data": null,
                "message": "Vote Deleted Successfully."
            });
        }        
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of deleteForumReplyVote

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
        else next(error);
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
        //const user = await userService.getIfNotCreateUser(userData);
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
            next(new ApplicationError(`Unauthorized Edit Attempt: Unauthorized Mark Answer Reply Edit by {userId: ${userData.userId}} on {postId: ${post.postId}}`));
            return res.status(500).json({ 
                "success": false,
                "data": null,
                "message": "Unauthorized User." 
            });
        }
        //Update reply answer as correct
        replyData.isAnswer = replyData.isAnswer === "true";
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
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of markForumReplyAsCorrectAnswer

exports.deleteForumPostReply = async (req, res, next) => {
    logger.info("deleteForumPostReply running");
    const replyId = req.params.r_id;
    const userData = req.body.userData;
    try {        
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
        //If reply userId and userData userId do not match
        else if (reply.userId != userData.userId) {
            next(new ApplicationError(`Unauthorized User trying to delete: {replyId: ${replyId}}`));
            return res.status(500).json({
                "success": false,
                "data": null,
                "message": "Unauthorized User." 
            });
        }
        //delete reply with replyId
        const results = await replyService.deleteReply(replyId);
        if (results) {
            logger.info(`Successfully deleted reply: {replyId: ${reply.replyId}}`);
            return res.status(200).json({  
                "success": true,
                "data": null,
                "message": "Reply Deleted Successfully." 
            });
        }
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of deleteForumPostReply

exports.rateCorrectForumReply = async (req, res, next) => {
    logger.info("rateCorrectForumReply running");
    const replyId = req.params.r_id;
    const ratingData = req.body.ratingData;
    const userData = req.body.userData;
    let errorMsg = "";
    try {        
        //Make sure there is a user with the userId before making answer as correct
        const user = await userService.getIfNotCreateUser(userData);
        // Check if reply with replyId provided exists
        const reply = await replyService.getReplyById(replyId);
        //If reply does not exist return error
        if (reply == null) {
            errorMsg = "Reply does not exist.";
            throw new ApplicationError(`Reply does not exist: {replyId: ${replyId}}`);
        } else if (!reply.isAnswer) {
            errorMsg = "Reply is not a correct answer.";
            throw new ApplicationError(`Reply is not a correct answer: {replyId: ${replyId}}`);
        }
        const rating = await replyService.checkForCorrectReplyRating(reply.replyId, user.userId);
        let results;
        //if rating exists update it else create it
        if (rating) {
            results = await replyService.updateCorrectReplyRating(ratingData.rating, reply.replyId, user.userId);
        } else {
            results = await replyService.rateCorrectReply(ratingData.rating, reply.replyId, user.userId);
        }        
        if (results) {
            logger.info(`Successfully rated correct reply: ${results.replyId}`);
            return res.status(200).json({
                "success": true,
                "data": {
                    replyId: replyId
                },
                "message": "Correct Reply Rated Successfully"
            });
        }
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        if (errorMsg === "") errorMsg = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errorMsg 
        });
    }
}; //End of rateCorrectForumReply