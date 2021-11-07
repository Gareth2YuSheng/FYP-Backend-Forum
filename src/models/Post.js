const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Post = sequelize.define("Post", {
        postId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        objective: {
            type: DataTypes.STRING,
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
        topicId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    }, {
        tableName: "post"
    }
);


module.exports = Post;