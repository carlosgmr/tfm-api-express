var baseController = require('./base.js');
var model = require('../models/questionary');
var config = model.config;
var pool = require('../modules/database');

module.exports.listing = baseController.listing(config, 'questionary.listing');
module.exports.read = baseController.read(config, 'questionary.read');
module.exports.create = baseController.create(config, 'questionary.create');
module.exports.update = baseController.update(config, 'questionary.update');
module.exports.delete = baseController.delete(config, 'questionary.delete');

module.exports.readComplete = function(req, res, next) {
    var route = 'questionary.readComplete';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var id = req.params.id;
    var result = {};

    //questionary
    var query = 'SELECT '+
            'q.`id` AS `questionary_id`,'+
            'q.`title` AS `questionary_title`,'+
            'q.`description` AS `questionary_description`,'+
            'q.`created_at` AS `questionary_created_at`,'+
            'q.`updated_at` AS `questionary_updated_at`,'+
            'q.`public` AS `questionary_public`,'+
            'q.`active` AS `questionary_active`,'+
            'g.`id` AS `group_id`,'+
            'g.`name` AS `group_name`,'+
            'qm.`id` AS `questionary_model_id`,'+
            'qm.`name` AS `questionary_model_name` '+
        'FROM '+
            '`questionary` AS q '+
            'INNER JOIN `group` AS g ON q.`group` = g.`id` '+
            'INNER JOIN `questionary_model` AS qm ON q.`model` = qm.`id` '+
        'WHERE '+
            'q.`id` = ?';

    pool.query(query, [id], function (error, questionnaires, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        if (questionnaires.length === 0) {
            return res.status(404).send({
                'error':['El recurso solicitado no existe']
            });
        }

        var questionary = questionnaires[0];
        result['id'] = questionary['questionary_id'];
        result['title'] = questionary['questionary_title'];
        result['description'] = questionary['questionary_description'];
        result['created_at'] = questionary['questionary_created_at'];
        result['updated_at'] = questionary['questionary_updated_at'];
        result['public'] = questionary['questionary_public'];
        result['active'] = questionary['questionary_active'];
        result['group'] = {
            'id': questionary['group_id'],
            'name': questionary['group_name']
        };
        result['model'] = {
            'id': questionary['questionary_model_id'],
            'name': questionary['questionary_model_name']
        };

        //questions
        result['questions'] = [];
        var queryQuestions = 'SELECT '+
                'q.`id` AS `question_id`,'+
                'q.`statement` AS `question_statement`,'+
                'qm.`id` AS `question_model_id`,'+
                'qm.`name` AS `question_model_name`,'+
                'q.`active` AS `question_active` '+
            'FROM '+
                '`question` AS q '+
                'INNER JOIN `question_model` AS qm ON q.`model` = qm.`id` '+
            'WHERE '+
                'q.`questionary` = ? '+
            'ORDER BY '+
                'q.`sort`';
        var indexQuestions = {};

        pool.query(queryQuestions, [id], function (error, questions, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            var question;
            for (var index=0; index<questions.length; index++) {
                question = questions[index];
                indexQuestions[question['question_id']] = index;
                result['questions'].push({
                    'id': question['question_id'],
                    'statement': question['question_statement'],
                    'model': {
                        'id': question['question_model_id'],
                        'name': question['question_model_name']
                    },
                    'active': question['question_active'],
                    'answers': []
                });
            }

            //answers
            var queryAnswers = 'SELECT `id`,`question`,`statement`,`correct` '+
                    'FROM `answer` '+
                    'WHERE `question` IN (SELECT `id` FROM `question` WHERE `questionary` = ?) '+
                    'ORDER BY `question`, `id`';

            pool.query(queryAnswers, [id], function (error, answers, fields) {
                if (error) {
                    return res.status(500).send({
                        'error':error
                    });
                }

                var answer, index;
                for (var i=0; i<answers.length; i++) {
                    answer = answers[i];
                    index = indexQuestions[answer['question']];
                    result['questions'][index]['answers'].push({
                        'id': answer['id'],
                        'statement': answer['statement'],
                        'correct': answer['correct']
                    });
                }

                //usuarios que han realizado el examen
                var queryUsers = 'SELECT u.`id`,u.`name`,u.`surname_1`,u.`surname_2` '+
                        'FROM `registry` AS r INNER JOIN `user` AS u ON r.`user` = u.`id` '+
                        'WHERE r.`questionary` = ? '+
                        'GROUP BY u.`id` '+
                        'ORDER BY u.`surname_1`,u.`surname_2`,u.`name`';

                pool.query(queryUsers, [id], function (error, users, fields) {
                    if (error) {
                        return res.status(500).send({
                            'error':error
                        });
                    }

                    result['users'] = users;
                    return res.status(200).send(result);
                });
            });
        });
    });
};