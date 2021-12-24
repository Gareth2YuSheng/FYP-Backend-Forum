const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    cloudinaryUrl: process.env.CLOUDINARY_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    
    JWTKey: process.env.JWTKEY,

    rdsHostUrl: process.env.RDS_HOST,
    rdsPortNum: process.env.RDS_PORT,
    rdsDBName: process.env.RDS_DB_NAME,
    rdsDBUsername: process.env.RDSDB_USERNAME,
    rdsDBPassword: process.env.RDS_DB_PASSWORD
};