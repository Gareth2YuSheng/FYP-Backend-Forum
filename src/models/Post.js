const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define("Post", {
        postId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true,
            validate: {
                notNull: true
            }
        },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         notNull: true,
        //         isInt: true
        //     }
        // },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        createdTime: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        tableName: "post"
    }
);

module.exports = Post;