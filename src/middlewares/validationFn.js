//For input validation and output sanitization functions
const validator = require("validator");
const { logger } = require("../logger/logger");
const { ValidationError } = require("../errors/errors");

function objValidateEmptyOrNull(object) { //if Valid return true, Invalid return false
    if (object == null) return false;
    if (Object.keys(object).length < 1) return false;
    return true;
}

function validateUUID(uuid) {
    if (uuid == null || uuid === "") return false;
    const reUuid = new RegExp(`^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$`);
    return reUuid.test(uuid);
}

function validateInt(num) {
    if (num == null || num === "") return false;
    const reInt = new RegExp(`^[0-9]+$`);
    return reInt.test(num);
}

function validateTopicData(topicData) {
    let errorMsg = "";
    //Null checks
    if (!objValidateEmptyOrNull(topicData)) {
        errorMsg = "Missing topicData";
    } else if (!topicData.subjectId || !topicData.subjectName || !topicData.gradeId || !topicData.gradeName || !topicData.children) {
        errorMsg = "Missing data in topicData";
    }
    //Check for valid subjectId 
    else if (!validateUUID(topicData.subjectId)) {
        errorMsg = "Invalid subjectId";
    }
    //Check for valid gradeId 
    else if (!validateUUID(topicData.gradeId)) {
        errorMsg = "Invalid gradeId";
    }
    //Check if topicData contains a topic
    else if (topicData.children.length < 1) {
        errorMsg = "Topic Data must contain at least 1 topic";
    }
    if (errorMsg !== "") return [false, errorMsg];
    return [true, null];
}

const validationFn = {

    //FORUM VALIDATIONS
    validateCreateForumQuestion: function(req, res, next) {
        logger.info("validateCreateForumQuestion middleware called");
        let errorMsg = "";
        //parse the data from formData
        if (req.body.questionData) req.body.questionData = JSON.parse(req.body.questionData);    
        if (req.body.topicData) req.body.topicData = JSON.parse(req.body.topicData);
        if (req.body.userData) req.body.userData = JSON.parse(req.body.userData);
        if (req.body.file) req.body.file = JSON.parse(req.body.file);

        const questionData = req.body.questionData;   
        const topicData = req.body.topicData;
        const userData = req.body.userData; //remove later once login is setup

        //Null or empty check
        if (!objValidateEmptyOrNull(questionData) || !objValidateEmptyOrNull(userData)) {
            errorMsg = "Missing questionData or missing userData";
        } else if (!questionData.questionTitle || !questionData.questionContent || !questionData.questionObjective) {
            errorMsg = "Missing data in questionData";
        } else if (!userData.userId || !userData.firstName || !userData.email || !userData.roleId) {
            errorMsg = "Missing data in userData";
        }
        //Validate topicData
        const [topicDataValid, topicErrorMsg] = validateTopicData(topicData);
        if (!topicDataValid) {
            errorMsg = topicErrorMsg;
        }        

        if (errorMsg === "") { //if no error message move on
            next();
        } else {
            logger.error("", new ValidationError("validateCreateForumQuestion Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateCreateForumQuestion
    
    validateEditForumQuestion: function(req, res, next) {
        logger.info("validateEditForumQuestion middleware called");
        let errorMsg = "";
        const questionId = req.params.q_id;
        const questionData = req.body.questionData;    
        const userData = req.body.userData; //remove later once login is setup
        const topicData = req.body.topicData;

        //Null or empty check
        if (!objValidateEmptyOrNull(questionData) || !objValidateEmptyOrNull(userData)) {
            errorMsg = "Missing questionData or missing userData";
        }
        //Check for valid questionId 
        else if (!validateUUID(questionId)) {
            errorMsg = "Invalid questionId";
        }
        //Check for valid userId 
        else if (!validateUUID(userData.userId)) {
            errorMsg = "Invalid userData";
        }
        //Validate Topic Data if exists
        else if (topicData) {
            //Validate topicData
            const [topicDataValid, topicErrorMsg] = validateTopicData(topicData);
            if (!topicDataValid) {
                errorMsg = topicErrorMsg;
            }
        }

        if (errorMsg === "") {
            next();
        } else {
            logger.error("", new ValidationError("validateEditForumQuestion Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateEditForumQuestion

    validateGetForumQuestions: function(req, res, next) {
        logger.info("validateGetForumQuestions middleware called");
        let errorMsg = "";
        const { count, page, subject, grade, topic } = req.query;

        //Null or empty check
        if (count == null || count === "" || page == null || page === "") {
            errorMsg = "Missing count or page number";
        }
        //Check for valid count and page
        else if (!validateInt(count) || !validateInt(page) || page < 1) {
            errorMsg = "Invalid count or page num";
        }
        //Check for valid subjectId and gradeId and topicId 
        else if ((subject && !validateUUID(subject)) || (grade && !validateUUID(grade)) || (topic && !validateUUID(topic))) {
            errorMsg = "Invalid subjectId or gradeId or topicId";
        }

        if (errorMsg === "") {
            next();
        } else {
            logger.error("", new ValidationError("validateGetForumQuestions Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateGetForumQuestions

    validateGetForumQuestion: function(req, res, next) {
        logger.info("validateGetForumQuestion middleware called");
        let errorMsg = "";
        const questionId = req.params.q_id;

        //Check for valid questionId 
        if (!validateUUID(questionId)) {
            errorMsg = "Invalid questionId";
        }

        if (errorMsg === "") {
            next();
        } else {
            logger.error("", new ValidationError("validateGetForumQuestion Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateGetForumQuestion

    validateDeleteForumQuestion: function(req, res, next) {
        logger.info("validateDeleteForumQuestion middleware called");
        let errorMsg = "";
        const questionId = req.params.q_id;
        const userData = req.body.userData;
        //Check for valid questionId 
        if (!validateUUID(questionId)) {
            errorMsg = "Invalid questionId";
        }
        //Check for valid userId
        else if (!validateUUID(userData.userId)) {
            errorMsg = "Invalid userData";
        }

        if (errorMsg === "") {
            next();
        } else {
            logger.error("", new ValidationError("validateDeleteForumQuestion Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateDeleteForumQuestion

    validateCreateForumReply: function(req, res, next) {
        logger.info("validateCreateForumReply middleware called");
        let errorMsg = "";
        const replyData = req.body.replyData;
        const userData = req.body.userData; //remove later once login is setup

        //Null or empty check
        if (!objValidateEmptyOrNull(replyData) || !objValidateEmptyOrNull(userData)) {
            errorMsg = "Missing replyData or userData";
        } else if (!replyData.replyContent) {
            errorMsg = "Missing data in replyData";
        } else if (!userData.userId || !userData.firstName || !userData.email || !userData.roleId) {
            errorMsg = "Missing data in userData";
        } 
        //Check for valid userId 
        else if (!validateUUID(userData.userId)) {
            errorMsg = "Invalid userData";
        }

        if (errorMsg === "") { //if no error message move on
            next();
        } else {
            logger.error("", new ValidationError("validateCreateForumReply Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateCreateForumReply

    validateEditForumReply: function(req, res, next) {
        logger.info("validateEditForumReply middleware called");
        let errorMsg = "";
        const replyId = req.params.r_id;
        const replyData = req.body.replyData;
        const userData = req.body.userData; //remove later once login is setup

        //Null or empty check
        if (!objValidateEmptyOrNull(replyData) || !objValidateEmptyOrNull(userData)) {
            errorMsg = "Missing replyData or userData";
        } else if (!replyData.replyContent) {
            errorMsg = "Missing data in replyData";
        //Check for valid replyId 
        } else if (!validateUUID(replyId)) {
            errorMsg = "Invalid replyId";
        }

        if (errorMsg === "") {
            next();
        } else {
            logger.error("", new ValidationError("validateEditForumReply Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateEditForumReply

    validateMarkReplyAsAnswer: function(req, res, next) {
        logger.info("validateMarkReplyAsAnswer middleware called");
        let errorMsg = "";
        const replyId = req.params.r_id;
        const replyData = req.body.replyData;
        const userData = req.body.userData;
        //convert isAnswer to lower case
        replyData.isAnswer = replyData.isAnswer.toLowerCase();
        //Null or empty check
        if (!objValidateEmptyOrNull(userData) || !objValidateEmptyOrNull(replyData)) {
            errorMsg = "Missing userData or replyData";
        }
        //Check for valid replyId
        else if (!validateUUID(replyId)) {
            errorMsg = "Invalid replyId";
        } 
        //Check if userData contains userId and replyData contains isAnswer
        else if (!userData.userId && replyData.isAnswer != null){
            errorMsg = "Missing userId or isAnswer"
        }
        //Check if replyData.isAnswer is valid
        else if (replyData.isAnswer !== "true" && replyData.isAnswer !== "false") {
            errorMsg = "Invalid replyData";
        }
        if (errorMsg === "") {
            next();
        } else {
            logger.error("", new ValidationError("validateMarkReplyAsAnswer Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateMarkReplyAsAnswer

    validateGetForumQuestionReplies: function(req, res, next) {
        logger.info("validateGetForumQuestionReplies middleware called");
        let errorMsg = "";
        const questionId = req.params.q_id;
        const { count, page, userId } = req.query;

        //Null or empty check
        if (count == null || count === "" || page == null || page === "" || userId == null || userId === "") {
            errorMsg = "Missing count or page number or userId";
        }
        //Check for valid questionId 
        else if (!validateUUID(questionId) || !validateUUID(userId)) {
            errorMsg = "Invalid questionId or userId";
        }
        //Check for valid count and page
        else if (!validateInt(count) || !validateInt(page) || page < 1) {
            errorMsg = "Invalid count or page num";
        }

        if (errorMsg === "") {
            next();
        } else {
            logger.error("", new ValidationError("validateGetForumQuestionReplies Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateGetForumQuestionReplies

    validateVoteForumReply: function(req, res, next) {
        logger.info("validateVoteForumReply middleware called");
        let errorMsg = "";
        const replyId = req.params.r_id;
        const userData = req.body.userData;
        const voteData = req.body.voteData;
        
        //Null or empty check
        if (!objValidateEmptyOrNull(userData) || !objValidateEmptyOrNull(voteData)) {
            errorMsg = "Missing userData or voteData";
        } else if (!userData.userId || !userData.firstName || !userData.email || !userData.roleId) {
            errorMsg = "Missing data in userData";
        } 
        //Check for valid replyId
        else if (!validateUUID(replyId)) {
            errorMsg = "Invalid replyId";
        }
        //check if vote type is missing
        if (!voteData.type) {
            errorMsg = "Missing data in voteData";
        } else {
            //convert vote type to lowercase
            voteData.type = voteData.type.toLowerCase();
        }
        //check for valid vote type
        if (voteData.type !== "up" && voteData.type !== "down") {
            errorMsg = "Invalid vote type";
        }

        if (errorMsg === "") { //if no error message move on
            next();
        } else {
            logger.error("", new ValidationError("validateVoteForumReply Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateVoteForumReply

    validateDeleteVoteForumReply: function(req, res, next) {
        logger.info("validateDeleteVoteForumReply middleware called");
        let errorMsg = "";
        const replyId = req.params.r_id;
        const userData = req.body.userData;
        
        //Null or empty check
        if (!objValidateEmptyOrNull(userData)) {
            errorMsg = "Missing userData or voteData";
        } else if (!userData.userId) {
            errorMsg = "Missing data in userData";
        } 
        //Check for valid replyId
        else if (!validateUUID(replyId)) {
            errorMsg = "Invalid replyId";
        }

        if (errorMsg === "") { //if no error message move on
            next();
        } else {
            logger.error("", new ValidationError("validateDeleteVoteForumReply Failed: " + errorMsg));
            res.status(500).json({  
                "success": false,
                "data": null,
                "message": errorMsg 
            });
        }
    }, //End of validateDeleteVoteForumReply

    //sanitization function
    sanitizeResult: function (req, res, next){
        logger.info("sanitizeResult middleware called");
        // if (res.locals.data.data) {
        //     if (res.locals.data.data.fileData) {
        //         if (res.locals.data.data.fileData.length > 1) {
        //             for (x of res.locals.data.data.fileData) {
        //                 x.design_title = validator.escape(validator.stripLow(x.design_title)); 
        //                 x.design_description = validator.escape(validator.stripLow(x.design_description));
        //             }
        //         } else {
        //             res.locals.data.data.fileData.design_title = validator.escape(validator.stripLow(res.locals.data.data.fileData.design_title)); 
        //             res.locals.data.data.fileData.design_description = validator.escape(validator.stripLow(res.locals.data.data.fileData.design_description));
        //         }                
        //     } else if (res.locals.data.data.userData) {
        //         if (res.locals.data.data.userData.length > 1) {
        //             for (y of res.locals.data.data.userData) {
        //                 for (x of Object.keys(y)) {
        //                     if (typeof y[x] === 'string') y[x] = validator.escape(validator.stripLow(y[x]));
        //                 }
        //             }
        //         } else {
        //             for (x of Object.keys(res.locals.data.data.userData)) {
        //                 if (typeof res.locals.data.data.userData[x] === 'string') res.locals.data.data.userData[x] = validator.escape(validator.stripLow(res.locals.data.data.userData[x]));
        //             }
        //         }
        //     }
        // }
    } //End of sanitizeResult
}
 
module.exports = validationFn;