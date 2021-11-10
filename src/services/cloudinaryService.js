//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const config = require("../config/config");
const { logger } = require("../logger/logger");
const { CloudinaryError, ApplicationError } = require("../errors/errors");

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

/*Existing upload presets:
upload_forum_image
cloudinary.uploader.upload(file.path, { upload_preset: 'upload_forum_image' })
*/

// module.exports.uploadFileToCloudinary = function(file) {
//     logger.info("uploadFileToCloudinary running");
//     //upload the give file to cloudinary
//     return new Promise((res, rej) => {
//         cloudinary.uploader.upload(file.path, { upload_preset: 'upload_forum_image' })
//             .then((result) => {
//                 console.log(result);
//                 //Inspect whether I can obtain the file storage id and the url from cloudinary
//                 //after a successful upload.
//                 //console.log({imageURL: result.url, publicId: result.public_id});
//                 let data = { imageURL: result.url, publicId: result.public_id, status: 'success' };
//                 res(data);
//             }).catch((error) => {
//                 rej(new DatabaseError(error.message));
//             }); //End of try..catch
//     });
// } //End of uploadFileToCloudinary

module.exports.uploadStreamToCloudinary = function(buffer) {
    logger.info("uploadStreamToCloudinary running");
    //upload the give file that is stored in buffer to cloudinary
    return new Promise(function(res, rej) {
        try {
            //Create a powerful, writable stream object which works with Cloudinary
            let streamDestination = cloudinary.uploader.upload_stream({
                folder: 'forumPhotos',
                allowed_formats: 'png,jpg,jpeg',
                resource_type: 'image',
                // use_filename: true
            },
            function(error, result) {
                if (result) {
                    logger.info(`Successfully uploaded image: {image_url: ${result.url}}`);
                    let cloudinaryFileData = { url: result.url, publicId: result.public_id, status: 'success' };
                    res(cloudinaryFileData);
                }
                if (error) {
                    rej(new CloudinaryError(error.msg));
                }
            });
            streamifier.createReadStream(buffer).pipe(streamDestination);
        } catch (error) {
            rej(new ApplicationError(error.message));
        }
    });
} //End of uploadStreamToCloudinary

module.exports.deleteImageFromCloudinary = function(publicId) {
    logger.info("deleteImageFromCloudinary running");
    return new Promise(function(res, rej) {
        try {
            //Delete file from cloudinary with the given publicId
            cloudinary.uploader.destroy(publicId, function (error, result) {
                if (result) {
                    logger.info(`Successfully deleted image: {publicId: ${publicId}}`);                    
                    res(result);
                }
                if (error) {
                    rej(new CloudinaryError(error.msg));
                }                
            });
        } catch (error) {
            rej(new ApplicationError(error.message));
        }
    });
} //End of deleteImageFromCloudinary

