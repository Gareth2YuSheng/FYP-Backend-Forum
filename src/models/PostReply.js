const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const PostReply = sequelize.define("PostReply", {
        replyId: {
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
        isAnswer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        voteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notNull: true,
                isInt: true
            }
        },
        rating: {
            type: DataTypes.DECIMAL(10, 2),
            validate: {
                isDecimal:true
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