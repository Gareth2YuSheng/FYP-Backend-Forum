//Import Controllers
const testController = require("./controllers/testController");
const validateFn = require("./middlewares/validationFn");

//Match URL with controllers
exports.appRoute = router => {

    //router.post('/api/user/login', authController.processLogin); //example
    router.get("/api/test", testController.testRouteFunc);

    router.post("/api/test", testController.testRouteFuncPost);

    router.put("/api/test", testController.testRouteFuncPut);

    //sanitization function
    router.use(validateFn.sanitizeResult); 
};