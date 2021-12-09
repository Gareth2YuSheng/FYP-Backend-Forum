//Import Controllers
const testController = require("./controllers/testController"); //remove later
const authController = require("./controllers/authController");
const questionController = require("./controllers/questionController");
const replyController = require("./controllers/replyController");
const validationFn = require("./middlewares/validationFn");
const verifyFn = require("./middlewares/verifyFn");

const path = require("path");
const { FileError } = require("./errors/errors");

//import mutler 
const multer = require("multer");
const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 3500000, files: 5 }, //set limit for file size and number of file fields 
    fileFilter: (req, file, cb) => { //limit the file extentions
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
            cb(new FileError("File Type Not Supported!"), false);
            return;
        }
        cb(null, true);
    }
});

//Match URL with controllers
exports.appRoute = router => {
    //Testing routes remove later
    // router.get("/api/test", testController.testRouteFunc);
    // router.get("/api/subject_grade", testController.subjectsGrade);
    // router.post("/api/test", testController.testRouteFuncPost);
    // router.put("/api/test", testController.testRouteFuncPut);
    // router.delete("/api/test", testController.testRouteFuncDelete);

    //GET
    router.get("/question/:q_id/details", verifyFn.verifyToken, validationFn.validateGetForumQuestion, questionController.getForumQuestionDetails);
    router.get("/reply/:q_id?", verifyFn.verifyToken, validationFn.validateGetForumQuestionReplies, replyController.getForumQuestionReplies);
    router.get("/question/all?", verifyFn.verifyToken, validationFn.validateGetForumQuestions, questionController.getForumQuestions);
    router.get("/question/subject/count", verifyFn.verifyToken, questionController.getForumQuestionCountBySubject);

    //POST
    router.post("/login", authController.login);
    router.post("/register", authController.register);
    router.post("/question/create", verifyFn.verifyToken, upload.array("file", 6), validationFn.validateCreateForumQuestion, questionController.createForumQuestion);
    router.post("/reply/:q_id/create", verifyFn.verifyToken, validationFn.validateCreateForumReply, replyController.createForumReply);
    
    //PUT
    router.put("/question/:q_id/edit", verifyFn.verifyToken, validationFn.validateEditForumQuestion, questionController.editForumQuestionDetails);
    router.put("/reply/:r_id/edit", verifyFn.verifyToken, validationFn.validateEditForumReply, replyController.editForumReply);
    router.put("/reply/:r_id/correct", verifyFn.verifyToken, validationFn.validateMarkReplyAsAnswer, replyController.markForumReplyAsCorrectAnswer);
    router.put("/reply/:r_id/vote", verifyFn.verifyToken, validationFn.validateVoteForumReply, replyController.voteForumReply);

    //DELETE
    router.delete("/question/:q_id/delete", verifyFn.verifyToken, validationFn.validateDeleteForumQuestion, questionController.deleteForumQuestion);
    router.delete("/reply/:r_id/vote", verifyFn.verifyToken, validationFn.validateDeleteVoteForumReply, replyController.deleteForumReplyVote);

    //sanitization function
    router.use(validationFn.sanitizeResult); 
};