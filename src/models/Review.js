const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Review = sequelize.define("Review", {
        reviewId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        review: {
            type: DataTypes.TEXT
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
        tutorId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
    }, {
        tableName: "review",
        timestamps: true,
        updatedAt: false
    }
);

module.exports = Review;