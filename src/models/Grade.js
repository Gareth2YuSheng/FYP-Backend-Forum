const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Grade = sequelize.define("Grade", {
        gradeId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        gradeName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    },{
        tableName:"grade",
        timestamps: false
    }
);

module.exports = Grade;