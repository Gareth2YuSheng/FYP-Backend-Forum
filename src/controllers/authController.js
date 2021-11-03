const { ApplicationError } = require("../errors/errors");
const { logger } = require("../logger/logger");

exports.register = async (req, res, next) => {
    logger.info("register running");
    const replyId = req.params.r_id;
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
}; //End of register