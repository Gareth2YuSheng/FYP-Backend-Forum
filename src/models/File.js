const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const File = sequelize.define("File", {
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                notNull: true,
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
        // parentId: {
        //     type: DataTypes.INT,
        //     allowNull: false
        // },
    },{
        tableName:"file"
    }
);

module.exports = File;