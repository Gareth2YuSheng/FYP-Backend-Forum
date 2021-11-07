const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Topic = require("./Topic");

const TopicAssociation = sequelize.define("TopicAssociation", {
        topicId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
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