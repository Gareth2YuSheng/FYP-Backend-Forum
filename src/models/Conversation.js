const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Conversation = sequelize.define("Conversation", {
        conversationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true 
        },
        latestMsg: {
            type: DataTypes.TEXT
        },
        title: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: "conversation",
        timestamps: true,
        createdAt: false
    }
);

module.exports = Conversation;