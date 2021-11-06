const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TopicAssociation = sequelize.define("TopicAssociation", {
        topicId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        parentId: {
            type: DataTypes.UUID
        }
    }, {
        tableName: "topicAssociation",
        timestamps: false
    }
);

module.exports = TopicAssociation;