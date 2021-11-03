const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Subject = sequelize.define("Subject", {
        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                notNull: true,
                isInt: true
            }
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
        tableName:"subject"
    }
);

module.exports = Subject;