const { DatabaseError, CloudinaryError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const cloudinaryService = require("./cloudinaryService");
const fileService = require("../services/fileService");
const sequelize = require("../config/database");
const models = sequelize.models;

exports.createPost = (title, content, objective, userId, topicId, files, filesBase64) => {
    logger.info("createPost running");
    //create forumn post with the details provided
    return new Promise(async (res, rej) => {
        try {
            //create post
            const post = await models.Post.create({
                title: title,
                content: content,
                topicId: topicId,
                userId: userId,
                objective: objective
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

exports.getPostDetailsById = (postId) => {
    logger.info("getPostDetailsById running");
    //get forum post with the postId provided
    return new Promise(async (res, rej) => {
        try {
            const result = await models.Post.findOne({
                where: { postId: postId },
                order: [[models.File, "fileId", "DESC"]],
                include: [{
                    attributes: ["fileId","cloudinaryUrl"],
                    
                    model: models.File
                }, {
                    attributes: ["topicName", "subjectId"],
                    model: models.Topic,               
                    include: [{
                        attributes: ["subjectName"],
                        model: models.Subject
                    }]
                }, {
                    attributes: ["firstName", "lastName", "profileImage"],
                    model: models.User
                }]
            });
            res(result);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getPostDetailsById

exports.getPosts = (count, page, subject, topic) => { //send user data as well
    logger.info("getPosts running");
    const offset = (count*(page-1));
    if (subject == null) subject = "";
    if (topic == null) topic = "";
    //get forum post with the postId provided
    return new Promise(async (res, rej) => {
        try {
            let posts;
            if (subject==="" && topic==="") { //if no subject or topic was provided
                posts = await models.Post.findAll({ 
                    limit: count, 
                    offset: offset, 
                    order: [
                        ["createdAt", "DESC"],
                        [models.File, "fileId", "DESC"]
                    ],
                    include: [{
                        attributes: ["fileId","cloudinaryUrl"],
                        model: models.File
                    }, {
                        attributes: ["topicName", "subjectId"],
                        model: models.Topic,               
                        include: [{
                            attributes: ["subjectName"],
                            model: models.Subject
                        }]
                    }, {
                        attributes: ["firstName", "lastName", "profileImage"],
                        model: models.User
                    }]
                });
            } else {
                whereOptions = {}
                if (subject!=="" && topic==="") whereOptions = { subjectId: subject }
                else if (subject==="" && topic!=="") whereOptions = { topicId: topic }
                else whereOptions = { topicId: topic, subjectId: subject }
                posts = await models.Post.findAll({ 
                    limit: count, 
                    offset: offset,  
                    order: [
                        ["createdAt", "DESC"],
                        [models.File, "fileId", "DESC"]
                    ],               
                    include: [
                    {
                        attributes: ["fileId","cloudinaryUrl"],
                        model: models.File
                    },
                    {
                        attributes: ["topicName", "subjectId"],
                        model: models.Topic,      
                        where: whereOptions,                  
                        include: [{
                            attributes: ["subjectName"],
                            model: models.Subject
                        }]
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
} //End of getPosts

exports.editPost = (title, content, objective, topicId, post) => {
    logger.info("editPost running");
    //update forum post instance with the details provided
    return new Promise(async (res, rej) => {
        try {
            //update the fields in the post instance
            post.set({
                title: title,
                content: content,
                objective: objective,
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
