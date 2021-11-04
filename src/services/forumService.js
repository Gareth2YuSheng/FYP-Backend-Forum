const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = (title, content, userId, subjectId, status) => {
    logger.info("createPost running");
    //create forumn post with the details provided
    return new Promise(async (res, rej) => {
        try {
            const result = await Post.create({
                title: title,
                content: content,
                status: status,
                subjectId: subjectId,
                userId: userId
            });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of createPost
