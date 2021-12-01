const { ApplicationError, DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const postService = require("../services/postService");
const userService = require("../services/userService");
const topicService = require("../services/topicService");

exports.getForumQuestions = async (req, res, next) => {
    logger.info("getForumQuestions running");
    const { count, page, subject, topic, grade } = req.query;
    try { //sanitize results later
        const results = await postService.getPosts(count, page, subject, topic, grade);
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
        // return res.status(200).json({  
        //     "success": true,
        //     "data": null,
        //     "message": null 
        // });
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
    try {        
        //get question data
        const post = await postService.getPostDetailsById(questionId);
        //get question replies
        // const replies
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": {post},
            "message": null 
        });
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
    const questionId = req.params.q_id;
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
        return res.status(200).json({  
            "success": true,
            "data": results,
            "message": null 
        });
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
            questionData.questionObjective,
            user.userId, //userId to later be retrieved from JWT token
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
            questionData.questionObjective,
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
        // return res.status(200).json({  
        //     "success": true,
        //     "data": {
        //         postId: "yes"
        //     },
        //     "message": "Question Updated Successfully." 
        // });
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