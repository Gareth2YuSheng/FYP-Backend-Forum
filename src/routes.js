//Import Controllers
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

const urlPrefix = "/forum";

//Match URL with controllers
exports.appRoute = router => {

    //GET
    router.get(urlPrefix + "/question/:q_id/details?", verifyFn.verifyToken, validationFn.validateGetForumQuestion, questionController.getForumQuestionDetails);
    router.get(urlPrefix + "/reply/:q_id?", verifyFn.verifyToken, validationFn.validateGetForumQuestionReplies, replyController.getForumQuestionReplies);
    router.get(urlPrefix + "/question/all?", verifyFn.verifyToken, validationFn.validateGetForumQuestions, questionController.getForumQuestions);
    router.get(urlPrefix + "/question/subject/count", verifyFn.verifyToken, questionController.getForumQuestionCountBySubject);
    router.get(urlPrefix + "/user/:u_id/counts", verifyFn.verifyToken, validationFn.validateGetUserCounts, authController.getUserQuestionAndReplyCounts);
    router.get(urlPrefix + "/comment/:type/:id", verifyFn.verifyToken, validationFn.validateGetComments, questionController.getCommentsForPostOrReply);

    //POST
    router.post(urlPrefix + "/question/create", verifyFn.verifyToken, upload.array("file", 6), validationFn.validateCreateForumQuestion, questionController.createForumQuestion);
    router.post(urlPrefix + "/reply/:q_id/create", verifyFn.verifyToken, validationFn.validateCreateForumReply, replyController.createForumReply);
    router.post(urlPrefix + "/reply/:r_id/rate", verifyFn.verifyToken, validationFn.validateRateCorrectForumReply, replyController.rateCorrectForumReply);
    router.post(urlPrefix + "/comment/:type/:id", verifyFn.verifyToken, validationFn.validateCreateComment, questionController.commentOnForumPostOrReply);

    //PUT
    router.put(urlPrefix + "/question/:q_id/edit", verifyFn.verifyToken, validationFn.validateEditForumQuestion, questionController.editForumQuestionDetails);
    // router.put(urlPrefix + "/question/:p_id/like", verifyFn.verifyToken, validationFn.validateLikeForumQuestion, questionController.likeForumQuestion);
    router.put(urlPrefix + "/reply/:r_id/edit", verifyFn.verifyToken, validationFn.validateEditForumReply, replyController.editForumReply);
    router.put(urlPrefix + "/reply/:r_id/correct", verifyFn.verifyToken, validationFn.validateMarkReplyAsAnswer, replyController.markForumReplyAsCorrectAnswer);
    router.put(urlPrefix + "/reply/:r_id/vote", verifyFn.verifyToken, validationFn.validateVoteForumReply, replyController.voteForumReply);
    router.put(urlPrefix + "/question/:q_id/vote", verifyFn.verifyToken, validationFn.validateVoteForumPost, questionController.voteForumPost);
    router.put(urlPrefix + "/user/:u_id/update", verifyFn.verifyToken, validationFn.validateUpdateUser, authController.updateUserProfile);

    //DELETE
    router.delete(urlPrefix + "/question/:q_id/delete", verifyFn.verifyToken, validationFn.validateDeleteForumQuestion, questionController.deleteForumQuestion);
    // router.delete(urlPrefix + "/question/:p_id/like", verifyFn.verifyToken, validationFn.validateUnlikeForumQuestion, questionController.unlikeForumQuestion);
    router.delete(urlPrefix + "/reply/:r_id/vote", verifyFn.verifyToken, validationFn.validateDeleteVoteForumReply, replyController.deleteForumReplyVote);
    router.delete(urlPrefix + "/reply/:r_id/delete", verifyFn.verifyToken, validationFn.validateDeleteForumReply, replyController.deleteForumPostReply);
    router.delete(urlPrefix + "/question/:q_id/vote", verifyFn.verifyToken, validationFn.validateDeleteVoteForumPost, questionController.deleteForumPostVote);

    //sanitization function
    //router.use(validationFn.sanitizeResult); 

    router.use(validationFn.invalidURLPath);
};