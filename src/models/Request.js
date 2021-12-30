const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Request = sequelize.define("Request", {
        requestId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.CITEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        objective: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "PENDING",
            allowNull: false,
            validate: {
                notEmpty: true
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
        topicId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        tutorId: {
            type: DataTypes.UUID
        },
    }, {
        tableName: "request",
        timestamps: true,
        updatedAt: false
    }
);

module.exports = Request;