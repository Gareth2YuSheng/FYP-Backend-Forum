const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ChatMessage = sequelize.define("ChatMessage", {
        messageId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true 
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        //For images (allow null as not every message will have images)
        cloudinaryFileId: {
            type: DataTypes.STRING
        },
        cloudinaryUrl: {
            type: DataTypes.STRING
        },
        mimeType: {
            type: DataTypes.STRING
        },
        //Foreign Keys
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        conversationId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    }, {
        tableName: "chatMessage"
    }
);

module.exports = ChatMessage;