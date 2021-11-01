const validator = require("validator");
const { logger } = require("../logger/logger");
const { ApplicationError } = require("../errors/errors");

const validationFn = {
    //EXAMPLE
    // validateRegister: function (req, res, next) {
    //     logger.info("validateRegister middleware called");
    //     const fullName = req.body.fullName;
    //     const email = req.body.email;
    //     const password = req.body.password;
 
    //     refullName = new RegExp(`^[a-zA-Z\\s]+$`);
    //     rePassword = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$`);

    //     if (refullName.test(fullName) && rePassword.test(password) && validator.isEmail(email)) {
    //         next();
    //     } else {
    //         logger.error("", new ApplicationError("validateRegister Failed"));
    //         res.status(500);
    //         res.send(`{"message":"Error!!"}`);
    //     }
    // },





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
    }
}
 
module.exports = validationFn;