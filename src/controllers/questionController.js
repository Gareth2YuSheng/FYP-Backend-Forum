const { ApplicationError, DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const postService = require("../services/postService");
const userService = require("../services/userService");
const topicService = require("../services/topicService");

exports.getForumQuestions = async (req, res, next) => {
    logger.info("getForumQuestions running");
    const { count, page, subject, topic } = req.query;
    try { //sanitize results later
        const results = await postService.getPosts(count, page, subject, topic);
        if (results) {
            logger.info(`Successfully retrieved posts: {count:${count}, page:${page}, subject:${subject}, topic:${topic}}`);
            return res.status(200).json({  
                "success": true,
                "data": {
                    posts: results
                },
                "message": null 
            });
        }
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
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
}; //End of getForumQuestions

exports.getForumQuestionDetails = async (req, res, next) => {
    logger.info("getForumQuestionDetails running");
    const questionId = req.params.q_id;
    try {        
        //get question data
        const post = await postService.getPostById(questionId);
        //get question replies
        // const replies
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
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
}; //End of getForumQuestionDetails

exports.createForumQuestion = async (req, res, next) => {
    logger.info("createForumQuestion running");
    const questionData = req.body.questionData;    
    const userData = req.body.userData; //remove later once login is setup
    const topicData = req.body.topicData;
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
            user.userId, //userId to later be retrieved from JWT token
            topic.topicId);
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
        //Check if post topicId is the same as the new topic data
        const incoming_topicId = topicData.children.slice(-1)[0].topicId;
        let topicId;
        if (incoming_topicId != post.topicId) { //if new topicId sent update new topic
            const topic = await topicService.getTopicFromTopicData(topicData);
            topicId = topic.topicId;
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
        return res.status(200).json({  
            "success": true,
            "data": {
                postId: "yes"
            },
            "message": "Question Updated Successfully." 
        });
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
}; //End of editForumQuestionDetails

exports.deleteForumQuestion = async (req, res, next) => {
    logger.info("deleteForumQuestion running");
    const questionId = req.params.q_id;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
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
}; //End of deleteForumQuestion