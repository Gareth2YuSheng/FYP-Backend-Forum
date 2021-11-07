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
        console.log(req.body);
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

exports.subjectsGrade = async (req, res, next) => {
    logger.info("subjectsGrade running");

    try {
        const json = {"subjectGrade":{"21e4aee5-77c6-49e6-9041-3de51bd1e1ee":{"subject_id":"21e4aee5-77c6-49e6-9041-3de51bd1e1ee","subject_name":"A Maths","grades":[{"grade_id":"db58a6f8-45af-45fc-8e70-e996e7a7a50f","grade_name":"Primary 6","inherit_from":null},{"grade_id":"f0139ca8-75d5-4853-9b33-7d37ea293479","grade_name":"Secondary 3","inherit_from":null},{"grade_id":"a5f62a25-972a-4c4f-b935-36d53b09f2b4","grade_name":"Secondary 4","inherit_from":null}]},"cfff9f05-1923-4199-ab01-ccafce4e2dec":{"subject_id":"cfff9f05-1923-4199-ab01-ccafce4e2dec","subject_name":"Chemistry","grades":[{"grade_id":"a5f62a25-972a-4c4f-b935-36d53b09f2b4","grade_name":"Secondary 4","inherit_from":null}]},"3518e351-1122-44b2-80f5-5cd06365c228":{"subject_id":"3518e351-1122-44b2-80f5-5cd06365c228","subject_name":"E Maths","grades":[{"grade_id":"f0139ca8-75d5-4853-9b33-7d37ea293479","grade_name":"Secondary 3","inherit_from":null},{"grade_id":"a5f62a25-972a-4c4f-b935-36d53b09f2b4","grade_name":"Secondary 4","inherit_from":null}]},"eadbf18b-05cc-491b-bbf6-e519ddd5f9a3":{"subject_id":"eadbf18b-05cc-491b-bbf6-e519ddd5f9a3","subject_name":"Physics","grades":[{"grade_id":"f0139ca8-75d5-4853-9b33-7d37ea293479","grade_name":"Secondary 3","inherit_from":null}]},"36df3510-be61-4a38-8932-1b37ad20d8d4":{"subject_id":"36df3510-be61-4a38-8932-1b37ad20d8d4","subject_name":"Mathematics","grades":[{"grade_id":"db58a6f8-45af-45fc-8e70-e996e7a7a50f","grade_name":"Primary 6","inherit_from":null}]}}}

        //next(); //call sanitization middleware, only sanitize of there is output data that is strings
        return res.status(200).send(json);
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
}; //End of subjectsGrade