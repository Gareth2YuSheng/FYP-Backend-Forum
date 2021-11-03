const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
        status: {
            type: DataTypes.STRING,
            defaultValue: "OPEN",
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