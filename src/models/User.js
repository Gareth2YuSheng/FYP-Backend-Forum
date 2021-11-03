const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
            validate: {
                notNull: true,
                isInt: true
            }
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                isInt: true
            },
            references: {
                model: Role,
                key: "roleId"
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notNull: true,
                notEmpty: true
            }
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        profileImage: {
            type: DataTypes.STRING(300),
            validate: {
                isUrl: true
            }
        },
        rating: {
            type: DataTypes.DECIMAL(1,2),
            validate: {
                isDecimal:true
            }
        }
    },{
        tableName:"user"
    }
);

module.exports = User;