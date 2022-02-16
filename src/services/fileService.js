const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const sequelize = require("../config/database");
const models = sequelize.models;

exports.createFile = (cloudinaryFileId, cloudinaryUrl, fileName, mimeType, parentId) => {
    logger.info("createFile running");
    //create file with details provided
    return new Promise(async (res, rej) => {
        try {
            //create file record in DB
            const file = await models.File.create({
                cloudinaryFileId: cloudinaryFileId,
                cloudinaryUrl: cloudinaryUrl,
                fileName: fileName,
                mimeType: mimeType,
                postId: parentId
            });
            res(file);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of createFile

exports.getFilesForParent = (parentId) => {
    logger.info("getFilesForParent running");
    //get all files for post
    return new Promise(async (res, rej) => {
        try {
            //create file record in DB
            const files = await models.File.findAll({
                where: {
                    postId: parentId
                }
            });
            res(files);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getFilesForParent

exports.deleteFile = (fileId) => {
    logger.info("deleteFile running");
    //get all files for post
    return new Promise(async (res, rej) => {
        try {
            //delete file record in DB
            const files = await models.File.destroy({
                where: {
                    fileId: fileId
                }
            });
            res(files);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of deleteFile