const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const Post = require("../models/Post");

exports.createPost = (title, content, userId, topicId) => {
    logger.info("createPost running");
    //create forumn post with the details provided
    return new Promise(async (res, rej) => {
        try {
            const result = await Post.create({
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
            const result = await Post.findByPk(postId);
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getPostById

exports.getPosts = (count, page, subject="", topic="") => {
    logger.info("getPosts running");
    const offset = (count*(page-1));
    //get forum post with the postId provided
    return new Promise(async (res, rej) => {
        try {
            let result;
            if (subject==="" && topic==="") {
               result = await Post.findAll({ limit: count, offset: offset }); 
            } else {
                // result = await Post
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
