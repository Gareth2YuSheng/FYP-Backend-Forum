const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("User", {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profileImage: {
            type: DataTypes.STRING(300),
            validate: {
                isUrl: true
            }
        },
        rating: {
            type: DataTypes.DECIMAL(10, 2),
            validate: {
                isDecimal:true
            }
        },
        //Foreign Keys
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                isInt: true
            }
        }
    },{
        tableName:"user"
    }
);

module.exports = User;