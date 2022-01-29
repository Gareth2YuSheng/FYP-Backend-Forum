const { ApplicationError, DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const postService = require("../services/postService");
const replyService = require("../services/replyService");
const userService = require("../services/userService");
const topicService = require("../services/topicService");

exports.getForumQuestions = async (req, res, next) => {
    logger.info("getForumQuestions running");
    const { count, page, subject, topic, grade, userId, search } = req.query;
    try { //sanitize results later
        const posts = await postService.getPosts(count, page, subject, topic, grade, search, userId);
        if (posts) {
            logger.info(`Successfully retrieved posts: {count: ${count}, page: ${page}, subject: ${subject}, topic: ${topic}, grade: ${grade}}`);
            return res.status(200).json({  
                "success": true,
                "data": { posts },
                "message": null 
            });
        }
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of getForumQuestions

exports.getForumQuestionDetails = async (req, res, next) => {
    logger.info("getForumQuestionDetails running");
    const questionId = req.params.q_id;
    const { userId } = req.query;
    try {        
        //get question data
        const results = await postService.getPostDetailsById(questionId, userId);
        if (results) {
            logger.info(`Successfully retrieved post: {postId: ${results.postId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    post: results
                },
                "message": null 
            });
        } else {
            logger.info(`Post {postId: ${questionId}} doest not exist`);
            return res.status(200).json({  
                "success": true,
                "data": null,
                "message": "Post does not exist" 
            });
        }
    } catch (error) {
        //check if post exists
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of getForumQuestionDetails

exports.getForumQuestionCountBySubject = async (req, res, next) => {
    logger.info("getForumQuestionCountBySubject running");
    try {        
        //get subject data
        const subjects = await topicService.getAllSubjects();     
        //get question counts
        let results = {}, general = 0, count = 0;
        for (let s of subjects) {
            count = await topicService.getQuestionCountBySubjects(s.subjectId);
            results[s.subjectName] = count;
            general += count;
        } 
        results["General"] = general;
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        if (results) {
            logger.info(`Successfully retrieved subject counts`);
            return res.status(200).json({  
                "success": true,
                "data": results,
                "message": null 
            });
        }
    } catch (error) {
        //check if post exists
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of getForumQuestionCountBySubject

exports.createForumQuestion = async (req, res, next) => {
    logger.info("createForumQuestion running");
    const questionData = req.body.questionData;    
    const userData = req.body.userData; //remove later once login is setup
    const topicData = req.body.topicData;
    const files = req.files; //from multer
    const base64Files = (req.body.file != null) ? req.body.file : []; //from req body from frontend
    try {
        //Make sure there is a user with the userId before creating the post
        //Can remove the check once we start using our own login and register
        const user = await userService.getIfNotCreateUser(userData);
        //Make sure there is a topic with the topicId before creating the post
        const topic = await topicService.getTopicFromTopicData(topicData);
        //Create the Post
        const results = await postService.createPost(
            questionData.questionTitle, 
            questionData.questionContent,
            user.userId,
            topic.topicId,
            files,
            base64Files);
        if (results) {
            logger.info(`Successfully created post: {questionId: ${results.postId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    postId: results.postId
                },
                "message": "Question Posted Successfully." 
            });
        }
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error)
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of createForumQuestion

exports.editForumQuestionDetails = async (req, res, next) => {
    logger.info("editForumQuestionDetails running");
    const questionId = req.params.q_id;
    const questionData = req.body.questionData;
    const userData = req.body.userData; //remove later once login is setup
    const topicData = req.body.topicData;
    try {       
        //Check if post with questionId provided exists
        const post = await postService.getPostById(questionId);
        //If post does not exist return error
        if (post == null) {
            next(new ApplicationError(`Question does not exist: {questionId: ${questionId}}`));
            return res.status(500).json({ 
                "success": false,
                "data": null,
                "message": "Question does not exist." 
            });
        } 
        //Check if user is author of the post
        if (userData.userId != post.userId) {
            next(new ApplicationError(`Unauthorized Question Edit Attempt: Unauthorized Question Edit by {userId: ${userData.userId}} on {questionId: ${questionId}}`));
            return res.status(500).json({ 
                "success": false,
                "data": null,
                "message": "Unauthorized User." 
            });
        }
        let topicId;
        //if topicData was sent
        if (topicData) {
            //Check if post topicId is the same as the new topic data
            const incoming_topicId = topicData.children.slice(-1)[0].topicId;            
            if (incoming_topicId != post.topicId) { //if new topicId sent update new topic
                const topic = await topicService.getTopicFromTopicData(topicData);
                topicId = topic.topicId;
            } else { //else use back the old topic id
                topicId = post.topicId;
            }
        } else { //else use back the old topic id
            topicId = post.topicId;
        }
        
        //Update question data
        const results = await postService.editPost(
            questionData.questionTitle,
            questionData.questionContent,
            topicId,
            post
        );
        if (results) {
            logger.info(`Successfully updated post: {questionId: ${results.postId}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    postId: results.postId
                },
                "message": "Question Updated Successfully." 
            });
        }
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of editForumQuestionDetails

exports.deleteForumQuestion = async (req, res, next) => {
    logger.info("deleteForumQuestion running");
    const questionId = req.params.q_id;
    const userData = req.body.userData;
    try {        
        //Check if post with questionId provided exists
        const post = await postService.getPostById(questionId);
        //If post does not exist return error
        if (post == null) {
            next(new ApplicationError(`Question does not exist: {questionId: ${questionId}}`));
            return res.status(500).json({ 
                "success": false,
                "data": null,
                "message": "Question does not exist." 
            });
        } 
        //If post userId and userData userId do not match
        else if (post.userId != userData.userId) {
            next(new ApplicationError(`Unauthorized User trying to delete: {questionId: ${questionId}}`));
            return res.status(500).json({ 
                "success": false,
                "data": null,
                "message": "Unauthorized User." 
            });
        }
        //delete post with questionId
        const results = await postService.deletePost(questionId);
        if (results) {
            logger.info(`Successfully deleted post: {questionId: ${questionId}}`);
            return res.status(200).json({  
                "success": true,
                "data": null,
                "message": "Question Deleted Successfully." 
            });
        }
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of deleteForumQuestion

exports.voteForumPost = async (req, res, next) => {
    logger.info("voteForumPost running");
    const postId = req.params.q_id;
    const userData = req.body.userData;
    const voteData = req.body.voteData;
    voteData.type = voteData.type === "up";
    try {        
        //Make sure there is a user with the userId before upvoting post
        const user = await userService.getIfNotCreateUser(userData);
        //check if user has voted on this post before
        const vote = await postService.checkForVoteForPost(userData.userId, postId);
        //if vote exists and is the same type return
        if (vote && vote.type == voteData.type) {
            logger.info(`Vote: {voteId: ${vote.voteId}} for {postId: ${postId}} by {userId: ${userData.userId}} already exists`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    voteId: vote.voteId
                },
                "message": "User has already voted on this post."
            });
        } 
        //else if vote exists but is a different type change it
        else if (vote && vote.type != voteData.type) {
            const results = await postService.changeVoteType(vote, voteData.type);
            if (results) {
                logger.info(`Vote: {voteId: ${vote.voteId}} for {postId: ${postId}} by {userId: ${userData.userId}} has been changed to {type: ${voteData.type}}`);
                return res.status(200).json({  
                    "success": true,
                    "data": {
                        voteId: vote.voteId
                    },
                    "message": "User vote has been updated."
                });
            }            
        } 
        //else if vote doesnt exist create it
        else {
            //Create vote record and update post voteCount
            const results = await postService.voteForumPost(
                user.userId,
                postId,
                voteData.type);
            if (results) {
                logger.info(`Successfully created vote: {voteId: ${results.voteId}} for {postId: ${postId}}`);
                return res.status(200).json({  
                    "success": true,
                    "data": {
                        voteId: results.voteId
                    },
                    "message": "Vote Created Successfully."
                });
            }
        }
    } catch (error) {
        let errMsg = "Server is unable to process the request.";
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else {
            //Update this
            if (error.message === "insert or update on table \"vote\" violates foreign key constraint \"vote_postId_fkey\"") {
                errMsg = "Post does not exist.";
            }
            next(error);
        } 
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errMsg
        });
    }
}; //End of voteForumPost

exports.deleteForumPostVote = async (req, res, next) => {
    logger.info("deleteForumPostVote running");
    const postId = req.params.q_id;
    const userData = req.body.userData;
    try {        
        //Make sure there is a user with the userId before unvoting reply
        // const user = await userService.getIfNotCreateUser(userData);
        //check if user has voted on this reply before
        const vote = await postService.checkForVoteForPost(userData.userId, postId);
        if (vote == null) {
            next(new ApplicationError(`Vote by {userId: ${userData.userId}} does not exist for {postId: ${postId}}`));
            return res.status(500).json({
                "success": false,
                "data": null,
                "message": "Vote does not exist."
            });
        }
        const results = await postService.unvoteForumPost(vote, postId);
        if (results) {
            logger.info(`Successfully deleted vote: {voteId: ${vote.voteId}} for {postId: ${postId}}`);
            return res.status(200).json({  
                "success": true,
                "data": null,
                "message": "Vote Deleted Successfully."
            });
        }        
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": "Server is unable to process the request." 
        });
    }
}; //End of deleteForumPostVote

exports.commentOnForumPostOrReply = async (req, res, next) => {
    logger.info("commentOnForumPostOrReply running");
    const userData = req.body.userData;
    const commentData = req.body.commentData;
    const type = req.params.type.toLowerCase();
    const objectId = req.params.id;
    let errorMsg = "";
    try {
        //get object
        let object = null;
        if (type === "question") {
            object = await postService.getPostById(objectId);
        } else if (type === "reply") {
            object = await replyService.getReplyById(objectId);
        }
        //if object does not exist
        if (object == null) {
            errorMsg = type+" does not exist.";
            throw new ApplicationError(`Object of type: ${type} does not exist: {Id: ${objectId}}`);
        }
        //Create comment
        let results = null;
        if (type === "question") {
            results = await postService.createCommentForPost(commentData.commentContent, objectId, userData.userId);
        } else if (type === "reply") {
            results = await replyService.createCommentForReply(commentData.commentContent, objectId, userData.userId);
        }
        if (results) {
            logger.info(`Successfully created comment: {commentId: ${results.commentId}}`);
            return res.status(200).json({  
                "success": true,
                "data": { commentId: results.commentId },
                "message": "Comment Created Successfully." 
            });
        }        
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        if (errorMsg === "") errorMsg = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errorMsg 
        });
    }
}; //End of commentOnForumPostOrReply

exports.getCommentsForPostOrReply = async (req, res, next) => {
    logger.info("getCommentsForPostOrReply running");
    const { count, page } = req.query; 
    const type = req.params.type.toLowerCase();
    const objectId = req.params.id;
    let errorMsg = "";
    try {
        //get object
        let object = null;
        if (type === "question") {
            object = await postService.getPostById(objectId);
        } else if (type === "reply") {
            object = await replyService.getReplyById(objectId);
        }
        //if object does not exist
        if (object == null) {
            errorMsg = type+" does not exist.";
            throw new ApplicationError(`Object of type: ${type} does not exist: {Id: ${objectId}}`);
        }
        //Create comment
        let results = null;
        if (type === "question") {
            results = await postService.getCommentsForPost(objectId, count, page);
        } else if (type === "reply") {
            results = await replyService.getCommentsForReply(objectId, count, page);
        }
        if (results) {
            logger.info(`Successfully retrieved comments {count:${count}, page:${page}} for object {type: ${type}, id: ${objectId}}`);
            return res.status(200).json({  
                "success": true,
                "data": { comments: results },
                "message": null 
            });
        }        
    } catch (error) {
        if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
        else next(error);
        if (errorMsg === "") errorMsg = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": errorMsg 
        });
    }
}; //End of getCommentsForPostOrReply

// exports.likeForumQuestion = async (req, res, next) => {
//     logger.info("likeForumQuestion running");
//     const postId = req.params.p_id;
//     const userData = req.body.userData;
//     const likeData = req.body.likeData;
//     likeData.type = likeData.type === "up";
//     try {        
//         //Make sure there is a user with the userId before liking post
//         const user = await userService.getIfNotCreateUser(userData);
//         //check if user has liked this post before
//         const like = await postService.checkForLike(userData.userId, postId);
//         // if like exists and is the same type return
//         if (like && like.type == likeData.type) {
//             logger.info(`Like: {likeId: ${like.likeId}} for {postId: ${postId}} by {userId: ${userData.userId}} already exists`);
//             return res.status(200).json({  
//                 "success": true,
//                 "data": {
//                     likeId: like.likeId
//                 },
//                 "message": "User has already liked this post."
//             });
//         } 
//         //else if like doesnt exist create it
//         else {
//             //Create vote record and update reply voteCount
//             const results = await postService.likeForumQuestion(
//                 user.userId,
//                 postId,
//                 likeData.type);
//             if (results) {
//                 logger.info(`Successfully created like: {likeId: ${results.likeId}} for {postId: ${postId}}`);
//                 return res.status(200).json({  
//                     "success": true,
//                     "data": {
//                         likeId: results.likeId
//                     },
//                     "message": "Like Created Successfully."
//                 });
//             }
//         }
//     } catch (error) {
//         let errMsg = "Server is unable to process the request.";
//         if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
//         else {
//             if (error.message === "insert or update on table \"like\" violates foreign key constraint \"like_parentId_fkey\"") {
//                 errMsg = "Post does not exist.";
//             }
//             next(error);
//         } 
//         //response to be standardised for each request
//         return res.status(500).json({  
//             "success": false,
//             "data": null,
//             "message": errMsg
//         });
//     }
// }; //End of likeForumQuestion

// exports.unlikeForumQuestion = async (req, res, next) => {
//     logger.info("unlikeForumQuestion running");
//     const postId = req.params.p_id;
//     const userData = req.body.userData;
//     try {        
//         //Make sure there is a user with the userId before unvoting reply
//         // const user = await userService.getIfNotCreateUser(userData);
//         //check if user has like this post before
//         const like = await postService.checkForLike(userData.userId, postId);
//         if (like == null) {
//             next(new ApplicationError(`Like by {userId: ${userData.userId}} does not exist for {postId: ${postId}}`));
//             return res.status(500).json({
//                 "success": false,
//                 "data": null,
//                 "message": "Like does not exist."
//             });
//         }
//         const results = await postService.unlikeForumQuestion(like, postId);
//         if (results) {
//             logger.info(`Successfully deleted like: {likeId: ${like.likeId}} for {postId: ${postId}}`);
//             return res.status(200).json({  
//                 "success": true,
//                 "data": null,
//                 "message": "Like Deleted Successfully."
//             });
//         }        
//     } catch (error) {
//         if (!(error instanceof DatabaseError)) next(new ApplicationError(error.message));
//         else next(error);
//         //response to be standardised for each request
//         return res.status(500).json({  
//             "success": false,
//             "data": null,
//             "message": "Server is unable to process the request." 
//         });
//     }
// }; //End of unlikeForumQuestion