const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Topic = sequelize.define("Topic", {
        topicId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        topicName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        //Foreign Keys
        subjectId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    }, {
        tableName: "topic",
        timestamps: false
    }
);

module.exports = Topic;