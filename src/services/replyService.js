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

exports.getReplies = (count, page, content) => { //send user data as well
    logger.info("getReplies running");
    const offset = (count*(page-1));
    if (content == null) content = "";
    return new Promise(async (res, rej) => {
        try {
            let result;
            if (post==="" && content==="") { //if no post or content was provided
                result = await models.Post.findAll({ 
                    limit: count, 
                    include: [{
                        attributes: ["content"],
                        model: models.PostReply,
                        include: {
                            model: models.post
                                }
                            }, {
                        attributes: ["firstName", "lastName", "profileImage"],
                        model: models.User
                    }]
                });
            } else {
                whereOptions = {}
                if (post!=="" && content==="") whereOptions = { postId: post }
                if (content==="") whereOptions = { content: content }
                else whereOptions = { postId: post, content: content }
                result = await models.Post.findAll({ 
                    limit: count,                
                    include: [{
                        attributes: ["content"],
                        model: models.PostReply,
                        where: whereOptions,
                        include: {
                            model: models.post
                        }
                    }, {
                        attributes: ["firstName", "lastName", "profileImage"],
                        model: models.User
                    }]
                });
            }        
            res(posts);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getReplies

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

exports.markForumReplyAsCorrectAnswer = (isAnswer, reply) => {
    logger.info("markForumReplyAsCorrectAnswer running");
    //update forum post reply instance with the details provided
    return new Promise(async (res, rej) => {
        try {
            //update the fields in the post instance
            reply.set({
                isAnswer: isAnswer,
            });
            //save the changes to the DB
            const result = await reply.save();
            res(result);
        } catch (error) {
            rej( new DatabaseError(error.message));
        }
    });
} //End of markForumReplyAsCorrectAnswer