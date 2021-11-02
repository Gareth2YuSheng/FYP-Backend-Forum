//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require("cloudinary").v2;
const config = require("../config/config");

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    //upload_preset: 'upload_to_design' //check whats this later
});

