const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = require("./User");
const PostReply = require("./PostReply");

const Vote = sequelize.define("Vote", {
        voteId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            validate: {
                isInt: true
            }
        },
        type: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: true,
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
        tableName: "vote",
        timestamps: false
    }
);

module.exports = Vote;