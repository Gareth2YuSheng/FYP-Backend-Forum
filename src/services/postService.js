const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const cloudinaryService = require("./cloudinaryService");
const fileService = require("../services/fileService");
const sequelize = require("../config/database");
const models = sequelize.models;
const { Op } = require("sequelize");

exports.createPost = (title, content, userId, topicId, files, filesBase64) => {
    logger.info("createPost running");
    //create forum post with the details provided
    return new Promise(async (res, rej) => {
        try {
            //create post
            const post = await models.Post.create({
                title: title,
                content: content,
                topicId: topicId,
                userId: userId
            });
            //upload files to cloudinary and store filedata in DB
            if (files.length > 0) { //from multer
                let fileUploadResult, result;
                for (let i=0; i<files.length; i++) {
                    //upload to cloudinary
                    fileUploadResult = await cloudinaryService.uploadStreamToCloudinary(files[i].buffer);
                    //save file data in DB
                    result = await fileService.createFile(
                        fileUploadResult.publicId,
                        fileUploadResult.url,
                        files[i].originalname,
                        files[i].mimetype,
                        post.postId);
                }
            } else if (filesBase64.length > 0) { //from frontend
                let fileUploadResult, result;
                for (let i=0; i<filesBase64.length; i++) {
                    //upload to cloudinary as base64 encoded string
                    fileUploadResult = await cloudinaryService.uploadFileToCloudinary(filesBase64[i].uri);  
                    //save file data in DB
                    result = await fileService.createFile(
                        fileUploadResult.publicId,
                        fileUploadResult.url,
                        filesBase64[i].name,
                        filesBase64[i].type,
                        post.postId);
                }
            }
            res(post);
        } catch (error) {
            console.log(error)
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

exports.getPostDetailsById = (postId, userId) => {
    logger.info("getPostDetailsById running");
    //get forum post with the postId provided
    return new Promise(async (res, rej) => {
        try {
            const result = await models.Post.findOne({
                where: { postId: postId },
                order: [[models.File, "fileId", "DESC"]],
                include: [
                    {
                        attributes: ["fileId","cloudinaryUrl"],
                        model: models.File,
                        required: false
                    }, {
                        attributes: ["topicName", "subjectId", "gradeId"],
                        model: models.Topic,               
                        include: [{
                            attributes: ["subjectName"],
                            model: models.Subject
                        }, {
                            attributes: ["gradeName"],
                            model: models.Grade
                        }]
                    }, {
                        attributes: ["firstName", "lastName", "profileImage"],
                        model: models.User
                    },
                    // {
                    //     model: models.Like,
                    //     where: { userId: userId },
                    //     required: false
                    // }
                ]
            });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getPostDetailsById

exports.getPosts = (count, page, subject, topic, grade, search, userId) => { //send user data as well
    logger.info("getPosts running");
    const offset = (count*(page-1));
    //get forum posts
    return new Promise(async (res, rej) => {
        try {
            let whereOptions = {}, searchOptions = {};
            if (subject != null && subject !== "") whereOptions.subjectId = subject;
            if (topic != null && topic !== "") whereOptions.topicId = topic;
            if (grade != null && grade !== "") whereOptions.gradeId = grade;
            if (search != null && search !== "") {
                //set search options, no need to .toLowerCase as post title field is CITEXT type
                searchOptions.title = {
                    [Op.like]: `%${search}%`
                };
            }
            logger.info("WHERE OPTIONS:", whereOptions)
            const posts = await models.Post.findAll({ 
                limit: count, 
                offset: offset,  
                order: [
                    ["createdAt", "DESC"],
                    [models.File, "fileId", "DESC"]
                ],         
                where: searchOptions,      
                include: [
                    {
                        attributes: ["fileId","cloudinaryUrl"],
                        model: models.File,
                        required: false
                    },
                    {
                        attributes: ["topicName", "subjectId", "gradeId"],
                        model: models.Topic,      
                        where: whereOptions,                  
                        include: [{
                            attributes: ["subjectName"],
                            model: models.Subject
                        }, {
                            attributes: ["gradeName"],
                            model: models.Grade
                        }]
                    }, {
                        attributes: ["firstName", "lastName", "profileImage"],
                        model: models.User
                    }, 
                    // {
                    //     model: models.Like,
                    //     where: { userId: userId },
                    //     required: false
                    // }
                ]
            });   
            res(posts);
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

exports.deletePost = (postId) => {
    logger.info("deletePost running");
    //delete forum post instance provided
    return new Promise(async (res, rej) => {
        try {
            //delete the files in cloudinary, do not delete post first because file records will be deleted as well
            const files = await fileService.getFilesForParent(postId);
            let cloudinaryResult, result;
            for (let f=0; f<files.length; f++) {
                //delete the file from cloudinary
                cloudinaryResult = await cloudinaryService.deleteImageFromCloudinary(files[f].cloudinaryFileId);
                //delete the file records
                result = await fileService.deleteFile(files[f].fileId);
            }    
            //delete post
            result = await models.Post.destroy({
                where: { postId: postId }
            });     
            res("Post Deleted Successfully.");
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of deletePost

exports.incrementPostAnswerCount = (postId, increment) => {
    logger.info("incrementPostAnswerCount running");
    //update forum post answerCount
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Post.increment({ answerCount: increment }, { where: { postId: postId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    });
} //End of incrementPostAnswerCount

exports.incrementPostReplyCount = (postId, increment) => {
    logger.info("incrementPostReplyCount running");
    //update forum post replyCoun
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Post.increment({ replyCount: increment }, { where: { postId: postId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    });
} //End of incrementPostReplyCount

exports.voteForumPost = (userId, postId, type) => {
    logger.info("voteForumPost running");
    //update forum post voteCount, and create vote record in DB
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Vote.create({
                type: type,
                userId: userId,
                postId: postId
            });
            const increment = (type) ? 1 : -1;
            const voteResult = await models.Post.increment({ voteCount: increment }, { where: { postId: postId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of voteForumPost

exports.checkForVoteForPost = (userId, postId) => {
    logger.info("checkForVoteForPost running");
    //check if user has already voted for forum post  
    return new Promise(async (res, rej) => {
        try{
            const result = await models.Vote.findOne({
                where: { 
                    postId: postId,
                    userId: userId
                }
            });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of checkForVoteForPost

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
            const voteResult = await models.Post.increment({ voteCount: increment }, { where: { postId: vote.postId } });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of changeVoteType

exports.unvoteForumPost = (vote, postId) => {
    logger.info("unvoteForumPost running");
    //delete user's vote for a forum post 
    return new Promise(async (res, rej) => {
        try{
            const increment = (vote.type) ? -1 : 1;
            const result = await vote.destroy();
            //minus vote value from reply vote count
            const voteResult = await models.Post.increment({ voteCount: increment }, { where: { postId: postId } });
            res("Vote deleted successfully");
        } catch (error) {
            rej(new DatabaseError(error.message));
        }
    })
} //End of unvoteForumPost

// exports.likeForumQuestion = (userId, parentId, type) => {
//     logger.info("likeForumQuestion running");
//     //update forum post likeCount, and create like record in DB
//     return new Promise(async (res, rej) => {
//         try{
//             const result = await models.Like.create({
//                 type: type,
//                 userId: userId,
//                 parentId: parentId
//             });
//             const increment = (type) ? 1 : -1;
//             const likeResult = await models.Post.increment({likeCount: increment}, { where: { postId: parentId } });
//             res(result);
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }
//     })
// } //End of likeForumQuestion

// exports.checkForLike = (userId, parentId) => {
//     logger.info("checkForLike running");
//     //check if user has already liked for forum post  
//     return new Promise(async (res, rej) => {
//         try{
//             const result = await models.Like.findOne({
//                 where: { 
//                     parentId: parentId,
//                     userId: userId
//                 }
//             });
//             res(result);
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }
//     })
// } //End of checkForLike

// exports.unlikeForumQuestion = (like, postId) => {
//     logger.info("unlikeForumQuestion running");
//     //delete user's like for a forum post 
//     return new Promise(async (res, rej) => {
//         try{
//             const increment = (like.type) ? -1 : 1;
//             const result = await like.destroy();
//             //minus like value from post like count
//             const likeResult = await models.Post.increment({likeCount: increment}, { where: { postId: postId } });
//             res("Like deleted successfully");
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }
//     })
// } //End of unlikeForumQuestion

// exports.getLikesForPosts = (userId, posts) => { //send user data as well
//     logger.info("getLikesForPosts running");
//     //get likes for the provided post Ids made by a single user with provided userId
//     return new Promise(async (res, rej) => {
//         try {
//             const postIds = posts.map(post => (post.postId));
//             const likes = await models.Like.findAll({
//                 attributes: ["likeId", "type", "parentId"],
//                 where: {
//                     parentId: postIds,
//                     userId: userId
//                 }
//             });
//             res(likes);
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }        
//     });
// } //End of getLikesForPosts

// exports.getLikesForPost = (userId, postId) => { //send user data as well
//     logger.info("getLikesForPost running");
//     //get likes for the provided postId made by a single user with provided userId
//     return new Promise(async (res, rej) => {
//         try {
//             const like = await models.Like.findOne({
//                 attributes: ["likeId", "type"],
//                 where: {
//                     parentId: postId,
//                     userId: userId
//                 }
//             });
//             res(like);
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }        
//     });
// } //End of getLikesForPost