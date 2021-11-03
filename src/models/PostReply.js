const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PostReply = sequelize.define('PostReply', {
    replyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        validate: {
            notNull: true,
            isInt: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        validate: {
            notNull: true,
            isInt: true
        },
        references: {
            model: User,
            key: "userId"
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        validate: {
            notNull: true,
            isInt: true
        },
        references: {
            model: Post,
            key: "postId"
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
    isAnswer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: true
        }
    },
    // edited: {

    // },
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