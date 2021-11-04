const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PostReply = sequelize.define("PostReply", {
        replyId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
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
        },
        //Foreign Keys
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    }, {
        tableName: "postReply"
    }
);

module.exports = PostReply;