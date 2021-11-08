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
        const questionData = req.body.questionData;    
        const topicData = req.body.topicData;
        const userData = req.body.userData; //remove later once login is setup

        //Null or empty check
        if (!objValidateEmptyOrNull(questionData) || !objValidateEmptyOrNull(userData) || !objValidateEmptyOrNull(topicData)) {
            errorMsg = "Missing questionData or missing userData";
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
                "message": "Error!!" 
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
                "message": "Error!!" 
            });
        }
    }, //End of validateEditForumQuestion




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