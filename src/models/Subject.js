const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Subject = sequelize.define("Subject", {
        subjectId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        subjectName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    },{
        tableName:"subject",
        timestamps: false
    }
);

module.exports = Subject;