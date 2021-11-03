const { ApplicationError } = require("../errors/errors");
const { logger } = require("../logger/logger");

exports.getForumQuestionDetails = async (req, res, next) => {
    logger.info("getForumQuestionDetails running");
    const questionId = req.params.q_id;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": message 
        });
    }
}; //End of getForumQuestionDetails

exports.createForumQuestion = async (req, res, next) => {
    logger.info("createForumQuestion running");
    const questionData = req.body;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": message 
        });
    }
}; //End of createForumQuestion

exports.editForumQuestionDetails = async (req, res, next) => {
    logger.info("editForumQuestionDetails running");
    const questionId = req.params.q_id;
    const questionData = req.body;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": message 
        });
    }
}; //End of editForumQuestionDetails

exports.deleteForumQuestion = async (req, res, next) => {
    logger.info("deleteForumQuestion running");
    const questionId = req.params.q_id;
    const questionData = req.body;
    try {        
        
        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({  
            "success": true,
            "data": null,
            "message": null 
        });
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = "Server is unable to process the request.";
        //response to be standardised for each request
        return res.status(500).json({  
            "success": false,
            "data": null,
            "message": message 
        });
    }
}; //End of deleteForumQuestion