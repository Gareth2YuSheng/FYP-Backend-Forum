//For Auth token validation
//const config = require("../config/config"); //get token secret from config file 
const jwt = require("jsonwebtoken");
const { logger } = require('../logger/logger');
const { ApplicationError } = require('../errors/errors');

const verifyFn = { 

  verifyToken:  function (req, res, next) {
    logger.info("verifyToken middleware called");
    let token = req.headers['authorization'];
    res.type('json');
    if (!token || !token.includes("Bearer ")) {
      logger.error("", new ApplicationError("Unauthorized Access Attempt Was Made, No Token"));
      res.status(403);
      res.send(`{"Message":"Not Authorized"}`);
    } else {
        //Do not validate token first, not our token
    //   token = token.split('Bearer ')[1]; 
    //   jwt.verify(token,config.JWTKey,function(err,decoded){
    //     if(err){
    //       logger.error("", new ApplicationError("Unauthorized Access Attempt Was Made, Invalid Token"));
    //       res.status(403);
    //       res.send(`{"Message":"Not Authorized"}`);
    //     }else{
    //       req.body.userId = decoded.id;
    //       req.role = decoded.role;
    //       next();
    //     }
    //   });
    }
  },

}

module.exports = verifyFn;