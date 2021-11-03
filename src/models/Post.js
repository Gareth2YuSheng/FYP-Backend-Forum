const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define('Post', {
    postId: {
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
    // edited: {

    // },
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