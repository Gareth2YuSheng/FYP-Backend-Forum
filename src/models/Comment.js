const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Comment = sequelize.define("Comment", {
        commentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        //Foreign Keys
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        replyId: {
            type: DataTypes.UUID,
            allowNull: true
        }
    }, {
        tableName: "comment"
    }
);

module.exports = Comment;