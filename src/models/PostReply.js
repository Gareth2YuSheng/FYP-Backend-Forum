const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PostReply = sequelize.define("PostReply", {
        replyId: {
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
        // postId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         notNull: true,
        //         isInt: true
        //     }
        // },
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
        isAnswer: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        voteCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                isInt: true
            }
        }
    }, {
        tableName: "postReply"
    }
);

module.exports = PostReply;