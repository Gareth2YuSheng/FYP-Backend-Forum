const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ReplyRating = sequelize.define("ReplyRating", {
        replyRatingId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        rating: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notEmpty: true,
                isDecimal:true
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
        replyId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    }, {
        tableName: "replyRating",
        timestamps: false
    }
);

module.exports = ReplyRating;