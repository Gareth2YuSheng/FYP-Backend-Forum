//Get sequelize instance
const sequelize = require("./sequelize");

//Import models, sequelize instance auto detects the models 
//and adds them to sequelize.models
const Topic = require("../models/Topic");
const TopicAssociation = require("../models/TopicAssociation");
const User = require("../models/User");
const Post = require("../models/Post");
const PostReply = require("../models/PostReply");
const Role = require("../models/Role");
const Vote = require("../models/Vote");
const Subject = require("../models/Subject");
const Grade = require("../models/Grade");
const File = require("../models/File");
const Like = require("../models/Like");
const Request = require("../models/Request");
const Comment = require("../models/Comment");
const Conversation = require("../models/Conversation");
const ChatMessage = require("../models/ChatMessage");
const ConversationMember = require("../models/ConversationMember");
const Review = require("../models/Review");


//Define Associations
//post Table
sequelize.models.User.hasMany(sequelize.models.Post, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});
sequelize.models.Post.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});

//postReply Table
sequelize.models.Post.hasMany(sequelize.models.PostReply, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});
sequelize.models.PostReply.belongsTo(sequelize.models.Post, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});
sequelize.models.User.hasMany(sequelize.models.PostReply, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});
sequelize.models.PostReply.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});

//user Table
sequelize.models.Role.hasMany(sequelize.models.User, {
    foreignKey: {
        name: "roleId"
    }
});
sequelize.models.User.belongsTo(sequelize.models.Role, {
    foreignKey: {
        name: "roleId"
    }
});

//vote Table
sequelize.models.User.hasMany(sequelize.models.Vote, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});
sequelize.models.Vote.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});
sequelize.models.PostReply.hasMany(sequelize.models.Vote, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});
sequelize.models.Vote.belongsTo(sequelize.models.PostReply, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});

//like Table
sequelize.models.User.hasMany(sequelize.models.Like, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});
sequelize.models.Like.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    },
    onDelete: "CASCADE"
});
sequelize.models.Post.hasMany(sequelize.models.Like, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});
sequelize.models.Like.belongsTo(sequelize.models.Post, {
    foreignKey: {
        name: "parentId"
    },
    onDelete: "CASCADE"
});

//subject Table
sequelize.models.Subject.hasMany(sequelize.models.Topic, {
    foreignKey: {
        name: "subjectId"
    }
});
sequelize.models.Topic.belongsTo(sequelize.models.Subject, {
    foreignKey: {
        name: "subjectId"
    }
});

//grade Table
sequelize.models.Grade.hasMany(sequelize.models.Topic, {
    foreignKey: {
        name: "gradeId"
    }
});
sequelize.models.Topic.belongsTo(sequelize.models.Grade, {
    foreignKey: {
        name: "gradeId"
    }
});

//topic Table
sequelize.models.Topic.hasMany(sequelize.models.Post, {
    foreignKey: {
        name: "topicId"
    }
});
sequelize.models.Post.belongsTo(sequelize.models.Topic, {
    foreignKey: {
        name: "topicId"
    }
});
sequelize.models.Topic.hasMany(sequelize.models.TopicAssociation, {
    foreignKey: {
        as: "topic",
        name: "topicId"
    }
});
sequelize.models.Topic.hasMany(sequelize.models.TopicAssociation, {
    foreignKey: {
        as: "parent",
        name: "parentId"
    }
});
// sequelize.models.TopicAssociation.belongsToMany(sequelize.models.Topic, {
//     foreignKey: {
//         as: "parent",
//         name: "parentId"
//     }
// });

//fileTable
sequelize.models.Post.hasMany(sequelize.models.File, {
    foreignKey: {
        name: "postId"
    }
});
sequelize.models.File.belongsTo(sequelize.models.Post, {
    foreignKey: {
        name: "postId"
    }
});

//request Table
sequelize.models.Request.hasMany(sequelize.models.File, {
    foreignKey: {
        name: "requestId"
    }
});
sequelize.models.File.belongsTo(sequelize.models.Request, {
    foreignKey: {
        name: "requestId"
    }
});
sequelize.models.Topic.hasMany(sequelize.models.Request, {
    foreignKey: {
        name: "topicId"
    }
});
sequelize.models.Request.belongsTo(sequelize.models.Topic, {
    foreignKey: {
        name: "topicId"
    }
});
sequelize.models.User.hasMany(sequelize.models.Request, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.Request.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.User.hasMany(sequelize.models.Request, {
    foreignKey: {
        name: "tutorId"
    }
});
sequelize.models.Request.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "tutorId"
    }
});

//comment Table
sequelize.models.User.hasMany(sequelize.models.Comment, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.Comment.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.Post.hasMany(sequelize.models.Comment, {
    foreignKey: {
        name: "postId"
    }
});
sequelize.models.Comment.belongsTo(sequelize.models.Post, {
    foreignKey: {
        name: "postId"
    }
});
sequelize.models.PostReply.hasMany(sequelize.models.Comment, {
    foreignKey: {
        name: "replyId"
    }
});
sequelize.models.Comment.belongsTo(sequelize.models.PostReply, {
    foreignKey: {
        name: "replyId"
    }
});

//chatMessage Table
sequelize.models.User.hasMany(sequelize.models.ChatMessage, {
    foreignKey: {
        name: "senderId"
    }
});
sequelize.models.ChatMessage.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "senderId"
    }
});
sequelize.models.Conversation.hasMany(sequelize.models.ChatMessage, {
    foreignKey: {
        name: "conversationId"
    }
});
sequelize.models.ChatMessage.belongsTo(sequelize.models.Conversation, {
    foreignKey: {
        name: "conversationId"
    }
});

//conversationMember Table
sequelize.models.User.hasMany(sequelize.models.ConversationMember, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.ConversationMember.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.Conversation.hasMany(sequelize.models.ConversationMember, {
    foreignKey: {
        name: "conversationId"
    }
});
sequelize.models.ConversationMember.belongsTo(sequelize.models.Conversation, {
    foreignKey: {
        name: "conversationId"
    }
});

//review Table
sequelize.models.User.hasMany(sequelize.models.Review, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.Review.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "userId"
    }
});
sequelize.models.User.hasMany(sequelize.models.Review, {
    foreignKey: {
        name: "tutorId"
    }
});
sequelize.models.Review.belongsTo(sequelize.models.User, {
    foreignKey: {
        name: "tutorId"
    }
});

module.exports = sequelize;