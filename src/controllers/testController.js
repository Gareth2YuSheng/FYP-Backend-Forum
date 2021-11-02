const { ApplicationError } = require("../errors/errors");
const { logger } = require("../logger/logger");

exports.testRouteFunc = async (req, res, next) => {
    logger.info("testRouteFunc running");

    try {
        //<----- code logic
        
        //code logic ----->
        next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({"success": "true", "hello": "world"});
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = 'Server is unable to process the request.';
        return res.status(500).json({  //response to be standardised for each request
            "success": false,
            "data": null,
            "pagination": null,
            "message": message 
        });
    }
}; //End of testRouteFunc

exports.testRouteFuncPost = async (req, res, next) => {
    logger.info("testRouteFuncPost running");

    try {
        //<----- code logic
        const email = req.body.email;
        const password = req.body.password; 
        console.log(email);
        console.log(password);
        //code logic ----->
        next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({email, password});
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = 'Server is unable to process the request.';
        return res.status(500).json({  //response to be standardised for each request
            "success": false,
            "data": null,
            "pagination": null,
            "message": message 
        });
    }
}; //End of testRouteFuncPost

exports.testRouteFuncPut = async (req, res, next) => {
    logger.info("testRouteFuncPut running");

    try {
        //<----- code logic
        const email = req.body.email;
        const password = req.body.password; 
        console.log(email);
        console.log(password);
        //code logic ----->
        next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({email, password});
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = 'Server is unable to process the request.';
        return res.status(500).json({  //response to be standardised for each request
            "success": false,
            "data": null,
            "pagination": null,
            "message": message 
        });
    }
}; //End of testRouteFuncPut

exports.testRouteFuncDelete = async (req, res, next) => {
    logger.info("testRouteFuncDelete running");

    try {
        //<----- code logic
        const email = req.body.email;
        const password = req.body.password; 
        console.log(email);
        console.log(password);
        //code logic ----->
        next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).json({email, password});
    } catch (error) {
        next(new ApplicationError(error.message));
        let message = 'Server is unable to process the request.';
        return res.status(500).json({  //response to be standardised for each request
            "success": false,
            "data": null,
            "pagination": null,
            "message": message 
        });
    }
}; //End of testRouteFuncDelete

