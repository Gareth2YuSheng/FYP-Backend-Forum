//Import Controllers
const testController = require("./controllers/testController"); //remove later
const authController = require("./controllers/authController");
const questionController = require("./controllers/questionController");
const replyController = require("./controllers/replyController");
const validationFn = require("./middlewares/validationFn");
const verifyFn = require("./middlewares/verifyFn");

//Match URL with controllers
exports.appRoute = router => {
    //Testing routes remove later
    router.get("/api/test", testController.testRouteFunc);
    router.post("/api/test", testController.testRouteFuncPost);
    router.put("/api/test", testController.testRouteFuncPut);
    router.delete("/api/test", testController.testRouteFuncDelete);

    //GET
    router.get("/question/:q_id/details", verifyFn.verifyToken, questionController.getForumQuestionDetails);
    router.get("/reply/:q_id?", verifyFn.verifyToken, replyController.getForumQuestionReplies);
    router.get("/question/all", verifyFn.verifyToken, questionController.getForumQuestions);

    //POST
    router.post("/login", authController.login);
    router.post("/register", authController.register);
    router.post("/question/create", verifyFn.verifyToken, validationFn.validateCreateForumQuestion, questionController.createForumQuestion);
    router.post("/reply/:q_id/create", verifyFn.verifyToken, replyController.createForumReply);
    
    //PUT
    router.put("/question/:q_id/edit", verifyFn.verifyToken, validationFn.validateEditForumQuestion, questionController.editForumQuestionDetails);
    router.put("/reply/:r_id/edit", verifyFn.verifyToken, replyController.editForumReply);
    router.put("/reply/:r_id/correct", verifyFn.verifyToken, replyController.markForumReplyAsCorrectAnswer);
    router.put("/reply/:r_id/upvote", verifyFn.verifyToken, replyController.upvoteForumReply);
    router.put("/reply/:r_id/downvote", verifyFn.verifyToken, replyController.downvoteForumReply);

    //DELETE
    router.delete("/question/:q_id/delete", verifyFn.verifyToken, questionController.deleteForumQuestion);

    //sanitization function
    router.use(validationFn.sanitizeResult); 
};