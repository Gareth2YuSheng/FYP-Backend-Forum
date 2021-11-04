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
User.hasMany(Post, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});

//postReply Table
Post.hasMany(PostReply, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});
User.hasMany(PostReply, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});

//user Table
Role.hasMany(User, {
    foreignKey: {
        name: "roleId"
    }
});

//vote Table
User.hasMany(Vote, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});
PostReply.hasMany(Vote, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});

//subject Table
Subject.hasMany(Post, {
    foreignKey: {
        name: "subjectId"
    }
});

//fileTable
Post.hasMany(File, {
    foreignKey: {
        name: "parentId"
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
            //console.log(result);
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
    //Test User and Post, remove later
    User.create({
        email: "user1@users.com",
        firstName: "Bob",
        lastName: "The Builder",
        password: "password",
        roleId: 1
    }).then(result => {
        console.log(result.userId)
        Post.create({
            title: "HI",
            content: "HI",
            status: "OPEN",
            subjectId: 1,
            userId: result.userId
        })
    })
}

resetTables();
