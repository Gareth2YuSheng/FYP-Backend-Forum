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

exports.getReplies = (questionId, count, page, userId) => { //send user data as well
    logger.info("getReplies running");
    const offset = (count*(page-1));
    //get replies for a post with the given postId
    return new Promise(async (res, rej) => {
        try {
            const replies = await models.PostReply.findAll({ 
                limit: count,
                offset: offset,
                order: [ 
                    ["isAnswer", "DESC"],
                    ["voteCount", "DESC"],
                    ["createdAt", "DESC"]
                ],
                where: { parentId: questionId },
                include: [{
                    attributes: ["firstName", "lastName", "profileImage"],
                    model: models.User
                }, {
                    model: models.Vote,
                    where: { userId: userId },
                    required: false
                }]
            });                  
            res(replies);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getReplies

exports.getQuestionVotes = (replyIds, userId) => { //send user data as well
    logger.info("getQuestionVotes running");
    //get votes for a user with the given userId for the given replyIds
    return new Promise(async (res, rej) => {
        try {
            const votes = await models.Vote.findAll({ 
                where: { userId: userId, parentId: replyIds }
            });                  
            res(votes);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getQuestionVotes

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
            rej(new DatabaseError(error.message));
        }
    });
} //End of editReply

exports.voteForumReply = (userId, parentId, type) => {
    logger.info("voteForumReply running");
    //update forum post reply voteCount, and create vote record in DB
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Vote.create({
                type: type,
                userId: userId,
                parentId: parentId
            });
            const increment = (type) ? 1 : -1;
            const voteResult = await models.PostReply.increment({voteCount: increment}, { where: { replyId: parentId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of voteForumReply

exports.checkForVote = (userId, parentId) => {
    logger.info("checkForVote running");
    //check if user has already voted for forum post reply  
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Vote.findOne({
                where: { 
                    parentId: parentId,
                    userId: userId
                }
            });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of checkForVote

exports.changeVoteType = (vote, type) => { 
    logger.info("changeVoteType running");
    //update vote type given by user
    return new Promise(async (res, rej) => {
        try{
            //update the fields in the vote instance
            vote.set({
                type: type
            });
            const result = await vote.save();
            const increment = (type) ? 2 : -2; //increment 2 as this is changing vote type not adding a vote
            const voteResult = await models.PostReply.increment({voteCount: increment}, { where: { replyId: vote.parentId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of changeVoteType

exports.unvoteForumReply = (vote, replyId) => {
    logger.info("unvoteForumReply running");
    //delete user's vote for a forum post reply 
    return new Promise(async (res, rej) => {
        try{
            const increment = (vote.type) ? -1 : 1;
            const result = await vote.destroy();
            //minus vote value from reply vote count
            const voteResult = await models.PostReply.increment({voteCount: increment}, { where: { replyId: replyId } });
            res("Vote deleted successfully");
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of unvoteForumReply

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
            rej(new DatabaseError(error.message));
        }
    });
} //End of markForumReplyAsCorrectAnswer