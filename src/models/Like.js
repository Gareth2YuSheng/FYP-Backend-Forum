const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Like = sequelize.define("Like", {
        likeId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: true,
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
        parentId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    }, {
        tableName: "like",
        timestamps: false
    }
);

module.exports = Like;