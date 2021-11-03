const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    cloudinaryUrl: process.env.CLOUDINARY_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    
    JWTKey: process.env.JWTKEY,

    databaseUser: process.env.DB_USER,
    databasePassword: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME,
    databaseUrl: process.env.DB_URL,
    
};