const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const sequelize = require("../config/database");
const models = sequelize.models;

exports.createReply = (content, userId, parentId) => {
    logger.info("createReply running");
    //create forum reply with the details provided
    return new Promise(async (res, rej) => {
        try {
            const result = await models.PostReply.create({
                content: content,
                userId: userId,
                parentId: parentId
            });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of createReply

exports.getReplyById = (replyId) => {
    logger.info("getReplyById running");
    //get forum post reply with the replyId provided
    return new Promise(async (res, rej) => {
        try {
            const result = await models.PostReply.findByPk(replyId);
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    });
}   //End of getReplyById

exports.getReplies = (questionId, count, page) => { //send user data as well
    logger.info("getReplies running");
    const offset = (count*(page-1));
    //get replies for a post with the given postId
    return new Promise(async (res, rej) => {
        try {
            const replies = await models.PostReply.findAll({ 
                limit: count,
                offset: offset,
                order: [ ["isAnswer", "DESC"] ],
                where: { parentId: questionId },
                include: [{
                    attributes: ["firstName", "lastName", "profileImage"],
                    model: models.User
                }]
            });                  
            res(replies);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getReplies

exports.getReplyCountForQuestion = (questionId) => { //send user data as well
    logger.info("getReplyCountForQuestion running");
    //get replies for a post with the given postId
    return new Promise(async (res, rej) => {
        try {
            const replyCount = await models.PostReply.count({ 
                where: { parentId: questionId }
            });                  
            res(replyCount);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getReplyCountForQuestion

exports.editForumReply = (content, userId, reply) => {
    logger.info("editReply running");
    //update forum post reply instance with the details provided
    return new Promise(async (res, rej) => {
        try {
            //update the fields in the post instance
            reply.set({
                content: content,
                userId: userId,
            });
            //save the changes to the DB
            const result = await reply.save();
            res(result);
        } catch (error) {
            rej( new DatabaseError(error.message));
        }
    });
} //End of editReply

exports.upvoteForumReply = (userId, parentId) => {
    logger.info("upvoteForumReply running");
    //update forum post reply voteCount positively, and create vote record in DB
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Vote.create({
                type: true,
                userId: userId,
                parentId: parentId
            });
            const upvoteResult = await models.PostReply.increment({voteCount: 1}, { where: { replyId: parentId } });
            res(result);
        } catch (error) {
            rej( new DatabaseError(error.message));
        }
    })
} //End of upvoteForumReply

exports.downvoteForumReply = (userId, parentId) => {
    logger.info("downvoteForumReply running");
    //update forum post reply voteCount negatively, and create vote record in DB
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Vote.create({
                type: false,
                userId: userId,
                parentId: parentId
            });
            const downvoteResult = await models.PostReply.increment({voteCount: -1}, { where: { replyId: parentId } });
            res(result);
        } catch (error) {
            rej( new DatabaseError(error.message));
        }
    })
} //End of upvoteForumReply

exports.markForumReplyAsCorrectAnswer = (isAnswer, reply) => {
    logger.info("markForumReplyAsCorrectAnswer running");
    //update forum post reply instance with the details provided
    return new Promise(async (res, rej) => {
        try {
            //update the fields in the post instance
            reply.set({
                isAnswer: isAnswer
            });
            //save the changes to the DB
            const result = await reply.save();
            res(result);
        } catch (error) {
            rej( new DatabaseError(error.message));
        }
    });
} //End of markForumReplyAsCorrectAnswer