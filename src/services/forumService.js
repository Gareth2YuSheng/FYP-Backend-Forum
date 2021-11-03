//Require DB instance
// const sequelize = require("../config/database");
const { DatabaseError } = require("../errors/errors");
const Post = require("../models/Post");

module.exports.createPost = (title, content, userId, subjectId, status) => {
    return new Promise(async (res, rej) => {
        try {
            let result = await Post.create({
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
