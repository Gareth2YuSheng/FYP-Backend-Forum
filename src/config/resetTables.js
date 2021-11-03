const { logger } = require("../logger/logger");
const { DatabaseError } = require("../errors/errors");
const { DataTypes } = require("sequelize");

//Require DB instance
const sequelize = require("./database");

//Import models
const User = require("../models/User");
const Post = require("../models/Post");
const PostReply = require("../models/PostReply");
const Role = require("../models/Role");
const Vote = require("../models/Vote");
const Subject = require("../models/Subject");
const File = require("../models/File");

//Define Associations
//post Table
User.hasMany(Post);
Post.belongsTo(User, {
    foreignKey: {
        name: "userId",
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: true,
            isInt: true
        }
    },
    onDelete: "CASCADE"
});

//postReply Table
Post.hasMany(PostReply);
PostReply.belongsTo(Post, {
    foreignKey: {
        name: "postId",
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: true
        }
    },
    onDelete: "CASCADE"
});
User.hasMany(PostReply);
PostReply.belongsTo(User, {
    foreignKey: {
        name: "userId",
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: true,
            isInt: true
        }
    },
    onDelete: "CASCADE"
});

//user Table
Role.hasMany(User);
User.belongsTo(Role, {
    foreignKey: {
        name: "roleId",
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: true,
            isInt: true
        }
    }
});

//vote Table
User.hasMany(Vote);
Vote.belongsTo(User, {
    foreignKey: {
        name: "userId",
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: true,
            isInt: true
        }
    },
    onDelete: "CASCADE"
});
PostReply.hasMany(Vote);
Vote.belongsTo(PostReply, {
    foreignKey: {
        name: "parentId",
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: true
        }
    },
    onDelete: "CASCADE"
});

//subject Table
Subject.hasMany(Post);
Post.belongsTo(Subject, {
    foreignKey: {
        name: "subjectId",
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: true,
            isInt: true
        }
    }
});

//fileTable
Post.hasMany(File);
File.belongsTo(Post, {
    foreignKey: {
        name: "parentId",
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: true
        }
    }
});


async function resetTables() {
    //Test DB connection
    await sequelize.testConnection();
    //Create the tables
    await sequelize.sync({ force: true })
        .then(result => {
            logger.info("Reset DB Tables successfully")
            // logger.info(result); //unable to stringify
            console.log(result);
        }).catch(error => {
            logger.error("", new DatabaseError(error.message));
        });
    //Insert the Roles: Student, tutor, parent
    Role.create({
        roleName: "STUDENT"
    });
    Role.create({
        roleName: "TUTOR"
    });
    Role.create({
        roleName: "PARENT"
    });
    //Insert the Subjects: A Maths, Chemistry, E Maths, Physics, Methematics
    Subject.create({
        subjectName: "A Maths"
    });
    Subject.create({
        subjectName: "Chemistry"
    });
    Subject.create({
        subjectName: "E Maths"
    });
    Subject.create({
        subjectName: "Physics"
    });
    Subject.create({
        subjectName: "Mathematics"
    }); 
}

resetTables();
