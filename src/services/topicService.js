const { DatabaseError } = require("../errors/errors");
const { logger } = require("../logger/logger");
const sequelize = require("../config/database");
const models = sequelize.models;

// exports.createSubject = (subjectName, subjectId=null) => {
//     logger.info("createSubject running");
//     //create new subject with the details provided
//     return new Promise(async (res, rej) => {
//         try {
//             let result;
//             if (subjectId) { //if subjectId was provided
//                 result = await Subject.create({
//                     subjectId: subjectId,
//                     subjectName: subjectName
//                 });
//             } else {
//                 result = await Subject.create({
//                     subjectName: subjectName
//                 });
//             }            
//             res(result);
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }        
//     });
// } //End of createSubject

// exports.getSubjectById = (subjectId) => {
//     logger.info("getSubjectById running");
//     //get subject name and id
//     return new Promise(async (res, rej) => {
//         try {
//             const result = await Subject.findByPk(subjectId);
//             res(result);
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }        
//     });
// } //End of getSubjectById

exports.getIfNotCreateSubject = (subjectId, subjectName) => {
    logger.info("getIfNotCreateSubject running");
    //get subject details if not create new subject with the details provided
    return new Promise(async (res, rej) => {
        try {
            const [subject, created] = await models.Subject.findOrCreate({
                where: { subjectId: subjectId },
                defaults: { subjectName: subjectName }
            });
            res(subject);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getIfNotCreateSubject

exports.getIfNotCreateGrade = (gradeId, gradeName) => {
    logger.info("getIfNotCreateGrade running");
    //get grade details if not create new grade with the details provided
    return new Promise(async (res, rej) => {
        try {
            const [grade, created] = await models.Grade.findOrCreate({
                where: { gradeId: gradeId },
                defaults: { gradeName: gradeName }
            });
            res(grade);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getIfNotCreateGrade

exports.getAllSubjects = () => {
    logger.info("getAllSubjects running");
    //get all subjects from subject table
    return new Promise(async (res, rej) => {
        try {
            const results = await models.Subject.findAll();
            res(results);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getAllSubjects

exports.getAllTopicsForASubject = (subjectId) => {
    logger.info("getAllTopicsForASubject running");
    //get all topics for a subject from topic table
    return new Promise(async (res, rej) => {
        try {             
            const results = await models.Topic.findAll({
                where: { subjectId: subjectId }
            });
            res(results);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getAllTopicsForASubject

exports.getQuestionCountBySubjects = (subjectId) => {
    logger.info("getQuestionCountBySubjects running");
    //get all subjects question count from database
    return new Promise(async (res, rej) => {
        try {
            const topics = await this.getAllTopicsForASubject(subjectId);
            const topicIds = topics.map(topic => (topic.topicId));
            const results = await models.Post.count({
                where: { topicId: topicIds }
            });
            res(results);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getQuestionCountBySubjects

// exports.getTopicById = (topicId) => {
//     logger.info("getTopicById running");
//     //get topic name, parentId and id
//     return new Promise(async (res, rej) => {
//         try {
//             const result = await Topic.findByPk(topicId);
//             res(result);
//         } catch (error) {
//             rej(new DatabaseError(error.message));
//         }        
//     });
// } //End of getTopicById

exports.getIfNotCreateTopic = (topicId, topicName, subjectId, gradeId) => {
    logger.info("getIfNotCreateTopic running");
    //get topic details if not create new topic with the details provided
    return new Promise(async (res, rej) => {
        try {
            const [topic, created] = await models.Topic.findOrCreate({
                where: { topicId: topicId },
                defaults: { 
                    topicName: topicName,
                    subjectId: subjectId,
                    gradeId: gradeId
                }
            });   
            res(topic);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getIfNotCreateTopic

exports.getIfNotCreateTopicAssociation = (topicId, parentId) => {
    logger.info("getIfNotCreateTopicAssociation running");
    //get topic association details if not create new association with the details provided
    return new Promise(async (res, rej) => {
        try {
            const [topicAssc, created] = await models.TopicAssociation.findOrCreate({
                where: { 
                    topicId: topicId,
                    parentId: parentId
                }
            });   
            res(topicAssc);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getIfNotCreateTopicAssociation

exports.getTopicFromTopicData = (topicData) => {
    logger.info("getTopicFromTopicData running");
    //get topic from the topicData
    return new Promise(async (res, rej) => {
        try {
            let topic, parentTopicId = null;
            //get subject first
            const subject = await this.getIfNotCreateSubject(topicData.subjectId, topicData.subjectName);
            //get grade second
            const grade = await this.getIfNotCreateGrade(topicData.gradeId, topicData.gradeName);
            //get/create each topic in the topics list
            const topics = topicData.children;
            for (let x=0; x<topics.length; x++) {
                topic = await this.getIfNotCreateTopic( 
                    topics[x].topicId,
                    topics[x].topicName,
                    subject.subjectId,
                    grade.gradeId
                );
                this.getIfNotCreateTopicAssociation(topic.topicId, parentTopicId);  
                parentTopicId = topic.topicId;            
            }
            res(topic);
        } catch (error) {
            rej(new DatabaseError(error.message));
        }        
    });
} //End of getTopicFromTopicData