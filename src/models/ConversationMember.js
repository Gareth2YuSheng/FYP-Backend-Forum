const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ConversationMember = sequelize.define("ConversationMember", {
        convoMemberId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true 
        },
        conversationId: {
            type: DataTypes.UUID,
            allowNull: false,            
            validate: {
                notNull: true
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,            
            validate: {
                notNull: true
            }
        },
        unseenNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: "conversationMember",
        timestamps: false
    }
);

module.exports = ConversationMember;