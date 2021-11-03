const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vote = sequelize.define('Vote', {
    voteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
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
    replyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: true,
            isInt: true
        },
        references: {
            model: postReply,
            key: "replyId"
        }
    },
    type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: true,
        }
    }
}, {
    tableName: "vote"
}
);

module.exports = Vote;