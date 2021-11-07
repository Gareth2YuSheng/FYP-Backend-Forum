const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const sequelize = require("../config/database");
const models = sequelize.models;

exports.createPost = (title, content, userId, topicId) => {
    logger.info("createPost running");
    //create forumn post with the details provided
    return new Promise(async (res, rej) => {
        try {
            const result = await models.Post.create({
                title: title,
                content: content,
                topicId: topicId,
                userId: userId
            });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of createPost

exports.getPostById = (postId) => {
    logger.info("getPostById running");
    //get forum post with the postId provided
    return new Promise(async (res, rej) => {
        try {
            const result = await models.Post.findByPk(postId);
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getPostById

exports.getPosts = (count, page, subject, topic) => { //send user data as well
    logger.info("getPosts running");
    const offset = (count*(page-1));
    if (subject == null) subject = "";
    if (topic == null) topic = "";
    //get forum post with the postId provided
    return new Promise(async (res, rej) => {
        try {
            let result;
            if (subject==="" && topic==="") { //if no subject or topic was provided
                result = await models.Post.findAll({ limit: count, offset: offset, include: models.Topic });
            } else {
                whereOptions = {}
                if (subject!=="" && topic==="") whereOptions = { subjectId: subject }
                else if (subject==="" && topic!=="") whereOptions = { topicId: topic }
                else whereOptions = { topicId: topic, subjectId: subject }
                result = await models.Post.findAll({ 
                    limit: count, 
                    offset: offset,
                    include: {
                        model: models.Topic,
                        where: whereOptions
                    }
                });
            }        
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getPosts

exports.editPost = (title, content, topicId, post) => {
    logger.info("editPost running");
    //update forum post instance with the details provided
    return new Promise(async (res, rej) => {
        try {
            //update the fields in the post instance
            post.set({
                title: title,
                content: content,
                topicId: topicId
            });
            //save the changes to the DB
            const result = await post.save();
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of editPost

exports.deletePost = (post) => {
    logger.info("deletePost running");
    //delete forum post instance provided
    return new Promise(async (res, rej) => {
        try {
            const result = await post.destroy();
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of deletePost
