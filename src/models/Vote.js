const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Vote = sequelize.define("Vote", {
        voteId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
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
        postId: {
            type: DataTypes.UUID
        },
        replyId: {
            type: DataTypes.UUID
        }
    }, {
        tableName: "vote",
        timestamps: false
    }
);

module.exports = Vote;