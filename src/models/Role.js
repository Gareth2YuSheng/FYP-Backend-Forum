const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define('Role', {
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            validate: {
                notNull: true,
                isInt: true
            }
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    },{
        tableName:"role"
    }
);

module.exports = Role;