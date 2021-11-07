const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Post = require("./Post");

const File = sequelize.define("File", {
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                isInt: true
            }
        },
        cloudinaryFileId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        cloudinaryUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        //Foreign Keys
        parentId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    },{
        tableName:"file"
    }
);

module.exports = File;