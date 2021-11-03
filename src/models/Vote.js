const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vote = sequelize.define("Vote", {
        voteId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            validate: {
                isInt: true
            }
        },
        type: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: true,
            }
        }
    }, {
        tableName: "vote",
        timestamps: false
    }
);

module.exports = Vote;