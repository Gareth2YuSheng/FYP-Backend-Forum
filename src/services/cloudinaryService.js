//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require("cloudinary").v2;
const config = require("../config/config");

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

/*Existing upload presets:
upload_forum_image
cloudinary.uploader.upload(file.path, { upload_preset: 'upload_forum_image' })
*/


