var baseController = require('./base.js');
var model = require('../models/user');
var config = model.config;
var pool = require('../modules/database');

module.exports.listing = baseController.listing(config, 'user.listing');
module.exports.read = baseController.read(config, 'user.read');
module.exports.create = baseController.create(config, 'user.create');
module.exports.update = baseController.update(config, 'user.update');
module.exports.delete = baseController.delete(config, 'user.delete');
module.exports.listingGroup = baseController.listingRelation(config, 'group', 'user.listing.group');

module.exports.currentGroup = function(req, res, next) {
    var route = 'user.current.group';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var data = req.body;
    var id = req.params.id;
    var query = 'SELECT `id`, `group` FROM `user_group` WHERE `user` = ?';
    var currentIds = [], toDelete = [], toInsert = [];

    pool.query(query, [id], function (error, currentState, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        currentState.forEach(function(current) {
            currentIds.push(current.group);
            if (data.group.indexOf(current.group) === -1) {
                toDelete.push(current.id);
            }
        });

        data.group.forEach(function(value) {
            if (currentIds.indexOf(value) === -1) {
                toInsert.push([id, value]);
            }
        });

        var step3 = function(){
            return baseController.listingRelation(config, 'group', route)(req, res, next);
        };
        var step2 = function(){
            if (toInsert.length > 0) {
                pool.query('INSERT INTO `user_group`(`user`, `group`) VALUES ?', [toInsert], function (error, results, fields) {
                    if (error) {
                        return res.status(500).send({
                            'error':error
                        });
                    }
                    step3();
                });
            } else {
                step3();
            }
        };
        var step1 = function(){
            if (toDelete.length > 0) {
                pool.query('DELETE FROM `user_group` WHERE `id` IN ?', [[toDelete]], function (error, results, fields) {
                    if (error) {
                        return res.status(500).send({
                            'error':error
                        });
                    }
                    step2();
                });
            } else {
                step2();
            }
        };

        step1();
    });
};

module.exports.questionnairesMade = function(req, res, next) {
    var route = 'user.listing.questionnairesMade';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var id = req.params.id;
    var query = 'SELECT '+
                'r.`questionary` AS `questionary_id`,'+
                'q.`group` AS `group_id`,'+
                'q.`title` AS `questionary_title`,'+
                'g.`name` AS `group_name` '+
            'FROM '+
                '`registry` AS r '+
                'INNER JOIN `questionary` AS q ON r.`questionary` = q.`id` '+
                'INNER JOIN `group` AS g ON q.`group` = g.`id` '+
            'WHERE '+
                'r.`user` = ? '+
            'GROUP BY '+
                'r.`questionary` '+
            'ORDER BY q.`group`, r.`questionary`';
    var bindings = [id];

    pool.query(query, bindings, function (error, questionarys, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        var results = [];
        for (var i=0; i<questionarys.length; i++) {
            results.push({
                'id': questionarys[i]['questionary_id'],
                'title': questionarys[i]['questionary_title'],
                'group': {
                    'id': questionarys[i]['group_id'],
                    'name': questionarys[i]['group_name']
                }
            });
        }

        return res.status(200).send(results);
    });
};

module.exports.questionaryDetails = function(req, res, next) {
    var route = 'user.read.questionaryDetails';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var idUser = req.params.id;
    var idQuestionary = req.params.idQuestionary;
    var result = {};

    //datos user
    var queryUser = 'SELECT `id`, `name`, `surname_1`, `surname_2` '+
            'FROM `user` '+
            'WHERE `id` = ?';
    pool.query(queryUser, [idUser], function (error, users, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }
        if (users.length === 0) {
            return res.status(404).send({
                'error':['El recurso solicitado no existe']
            });
        }

        result['user'] = users[0];

        //datos questionary
        var queryQuestionary = 'SELECT '+
                'q.`id` AS `questionary_id`,'+
                'q.`title` AS `questionary_title`,'+
                'q.`description` AS `questionary_description`,'+
                'g.`id` AS `group_id`,'+
                'g.`name` AS `group_name`,'+
                'qm.`id` AS `questionary_model_id`,'+
                'qm.`name` AS `questionary_model_name` '+
            'FROM '+
                '`questionary` AS q '+
                'INNER JOIN `questionary_model` AS qm ON q.`model` = qm.`id` '+
                'INNER JOIN `group` AS g ON q.`group` = g.`id` '+
            'WHERE q.`id` = ?';
        pool.query(queryQuestionary, [idQuestionary], function (error, questionnaires, fields) {
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
            result['questionary'] = {
                'id': questionary['questionary_id'],
                'title': questionary['questionary_title'],
                'description': questionary['questionary_description'],
                'group': {
                    'id': questionary['group_id'],
                    'name': questionary['group_name']
                },
                'model': {
                    'id': questionary['questionary_model_id'],
                    'name': questionary['questionary_model_name']
                }
            };

            //user made questionary?
            var queryMade = 'SELECT MAX(`created_at`) AS `last_date` FROM `registry` WHERE `user` = ? AND `questionary` = ?';
            pool.query(queryMade, [idUser, idQuestionary], function (error, made, fields) {
                if (error) {
                    return res.status(500).send({
                        'error':error
                    });
                }

                result['last_date'] = made[0]['last_date'];
                if (!result['last_date']) {
                    return res.status(200).send(result);
                }

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

                pool.query(queryQuestions, [idQuestionary], function (error, questions, fields) {
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
                            'answers': [],
                            'registry': null
                        });
                    }

                    //answers
                    var queryAnswers = 'SELECT `id`,`question`,`statement`,`correct` '+
                            'FROM `answer` '+
                            'WHERE `question` IN (SELECT `id` FROM `question` WHERE `questionary` = ?) '+
                            'ORDER BY `question`, `id`';

                    pool.query(queryAnswers, [idQuestionary], function (error, answers, fields) {
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

                        //registries
                        var queryRegistries = 'SELECT `id`,`question`,`answer`,`created_at` '+
                                'FROM `registry` '+
                                'WHERE `user` = ? AND `questionary` = ?';

                        pool.query(queryRegistries, [idUser, idQuestionary], function (error, registries, fields) {
                            if (error) {
                                return res.status(500).send({
                                    'error':error
                                });
                            }

                            var registry;
                            for (var i=0; i<registries.length; i++) {
                                registry = registries[i];
                                index = indexQuestions[registry['question']];
                                result['questions'][index]['registry'] = {
                                    'id': registry['id'],
                                    'answer': registry['answer'],
                                    'created_at': registry['created_at']
                                };
                            }

                            return res.status(200).send(result);
                        });
                    });
                });
            });
        });
    });
};

module.exports.questionnairesByGroupAndState = function(req, res, next) {
    var route = 'user.listing.questionnairesByGroupAndState';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var idUser = req.params.id;
    var idGroup = req.params.idGroup;
    var result = {};
    var queryDone = 'SELECT q.* '+
            'FROM '+
                '`registry` AS r '+
                'INNER JOIN `questionary` AS q ON r.`questionary` = q.`id` '+
            'WHERE '+
                'r.`user` = ? AND q.`group` = ? '+
            'GROUP BY '+
                'q.`id` '+
            'ORDER BY '+
                'q.`id`';
    var queryNotDone = 'SELECT * '+
            'FROM `questionary` '+
            'WHERE '+
                '`group` = ? AND '+
                '`active` = ? AND '+
                '`id` NOT IN (SELECT distinct(`questionary`) FROM `registry` WHERE `user` = ?) '+
            'ORDER BY `id`';

    pool.query(queryDone, [idUser, idGroup], function (error, results) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        result['done'] = results;

        pool.query(queryNotDone, [idGroup, 1, idUser], function (error, results) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            result['not_done'] = results;
            return res.status(200).send(result);
        });
    });
};

module.exports.questionnairesByState = function(req, res, next) {
    var route = 'user.listing.questionnairesByState';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var id = req.params.id;
    var result = {};
    var queryDone = 'SELECT '+
            'q.`id` AS `questionary_id`,'+
            'g.`id` AS `group_id`,'+
            'g.`name` AS `group_name`,'+
            'q.`title` AS `questionary_title`,'+
            'q.`description` AS `questionary_description`,'+
            'q.`model` AS `questionary_model`,'+
            'q.`created_at` AS `questionary_created_at`,'+
            'q.`updated_at` AS `questionary_updated_at`,'+
            'q.`public` AS `questionary_public`,'+
            'q.`active` AS `questionary_active` '+
        'FROM '+
            '`registry` AS r '+
            'INNER JOIN `questionary` AS q ON r.`questionary` = q.`id` '+
            'INNER JOIN `group` AS g ON q.`group` = g.`id` '+
        'WHERE '+
            'r.`user` = ? AND '+
            'q.`group` IN (SELECT distinct(`group`) FROM `user_group` WHERE `user` = ?) '+
        'GROUP BY '+
            'q.`id` '+
        'ORDER BY '+
            'q.`id`';
    var queryNotDone = 'SELECT '+
            'q.`id` AS `questionary_id`,'+
            'g.`id` AS `group_id`,'+
            'g.`name` AS `group_name`,'+
            'q.`title` AS `questionary_title`,'+
            'q.`description` AS `questionary_description`,'+
            'q.`model` AS `questionary_model`,'+
            'q.`created_at` AS `questionary_created_at`,'+
            'q.`updated_at` AS `questionary_updated_at`,'+
            'q.`public` AS `questionary_public`,'+
            'q.`active` AS `questionary_active` '+
        'FROM '+
            '`questionary` AS q '+
            'INNER JOIN `group` AS g ON q.`group` = g.`id` '+
        'WHERE '+
            'q.`active` = ? AND '+
            'q.`group` IN (SELECT distinct(`group`) FROM `user_group` WHERE `user` = ?) AND '+
            'q.`id` NOT IN (SELECT distinct(`questionary`) FROM `registry` WHERE `user` = ?) '+
        'ORDER BY '+
            'q.`id`';

    pool.query(queryDone, [id, id], function (error, items) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        result['done'] = config.formatQuestionnairesByState(items);

        pool.query(queryNotDone, [1, id, id], function (error, items) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            result['not_done'] = config.formatQuestionnairesByState(items);

            return res.status(200).send(result);
        });
    });
};