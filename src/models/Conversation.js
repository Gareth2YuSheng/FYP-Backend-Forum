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
            type: DataTypes.STRING,
            defaultValue: ""
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        //Foreign Keys
        requestId: {
            type: DataTypes.UUID,
            allowNull: true
        },
    }, {
        tableName: "conversation"
    }
);

module.exports = Conversation;