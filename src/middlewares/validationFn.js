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
    const reUuid = new RegExp(`^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$`);
    return reUuid.test(uuid);
}

const validationFn = {

    //FORUM VALIDATIONS
    validateCreateForumQuestion: function(req, res, next) {
        logger.info("validateCreateForumQuestion middleware called");
        let errorMsg = "";
        //parse the data from formData
        req.body.questionData = JSON.parse(req.body.questionData);    
        req.body.topicData = JSON.parse(req.body.topicData);
        req.body.userData = JSON.parse(req.body.userData);
        if (req.body.file) {
            req.body.file = JSON.parse(req.body.file)
        }

        const questionData = req.body.questionData;    
        const topicData = req.body.topicData;
        const userData = req.body.userData; //remove later once login is setup

        //Null or empty check
        if (!objValidateEmptyOrNull(questionData) || !objValidateEmptyOrNull(userData) || !objValidateEmptyOrNull(topicData)) {
            errorMsg = "Missing questionData or missing userData or topicData";
        } else if (!questionData.questionTitle || !questionData.questionContent || !questionData.questionObjective) {
            errorMsg = "Missing data in questionData";
        } else if (!topicData.subjectId || !topicData.subjectName || !topicData.children) {
            errorMsg = "Missing data in topicData";
        } else if (!userData.userId || !userData.firstName || !userData.lastName || !userData.email || !userData.roleId) {
            errorMsg = "Missing data in userData";
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

        //Null or empty check
        if (!objValidateEmptyOrNull(questionData) || !objValidateEmptyOrNull(userData)) {
            errorMsg = "Missing questionData or missing userData";
        }
        //Check for valid questionId 
        else if (!validateUUID(questionId)) {
            errorMsg = "Invalid questionId";
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
        const { count, page, subject, topic } = req.query;

        //Null or empty check
        if (count == null || count === "" || page == null || page === "") {
            errorMsg = "Missing count or page number";
        }
        //Check for valid subjectId and topicId 
        else if ((subject && !validateUUID(subject)) || (topic && !validateUUID(topic))) {
            errorMsg = "Invalid subjectId or topicId";
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

    validateDeleteForumQuestion: function(req, res, next) {
        logger.info("validateDeleteForumQuestion middleware called");
        let errorMsg = "";
        const questionId = req.params.q_id;

        //Check for valid questionId 
        if (!validateUUID(questionId)) {
            errorMsg = "Invalid questionId";
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
        } else if (!userData.userId || !userData.firstName || !userData.lastName || !userData.email || !userData.roleId) {
            errorMsg = "Missing data in userData";
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
        else if (userData.userId == (userData) && replyData.isAnswer == (replyData)){
            errorMsg = "Missing userId or isAnswer"
        }
        //Check if replyData is valid
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
        const { count, page } = req.query;

        //Null or empty check
        if (count == null || count === "" || page == null || page === "") {
            errorMsg = "Missing count or page number";
        }
        //Check for valid questionId 
        else if (!validateUUID(questionId)) {
            errorMsg = "Invalid questionId";
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