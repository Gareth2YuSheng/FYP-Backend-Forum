const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = (title, content, userId, subjectId) => {
    logger.info("createPost running");
    //create forumn post with the details provided
    return new Promise(async (res, rej) => {
        try {
            const result = await Post.create({
                title: title,
                content: content,
                subjectId: subjectId,
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
    //get forumn post with the postId provided
    return new Promise(async (res, rej) => {
        try {
            const result = await Post.findOne({ where: { postId: postId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getPostById

exports.editPost = (title, content, subjectId, post) => {
    logger.info("editPost running");
    //update forumn post instance with the details provided
    return new Promise(async (res, rej) => {
        try {
            //update the fields in the post instance
            post.set({
                title: title,
                content: content,
                subjectId: subjectId
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
    //delete forumn post instance provided
    return new Promise(async (res, rej) => {
        try {
            const result = await post.destroy();
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of deletePost
