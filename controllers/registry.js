var baseController = require('./base.js');
var model = require('../models/registry');
var config = model.config;
var pool = require('../modules/database');

module.exports.listing = baseController.listing(config, 'registry.listing');
module.exports.read = baseController.read(config, 'registry.read');
module.exports.create = baseController.notAllowed(); //'registry.create'
module.exports.update = baseController.notAllowed(); //'registry.update'
module.exports.delete = baseController.notAllowed(); //'registry.delete'

module.exports.saveAttempt = function(req, res, next) {
    var route = 'registry.saveAttempt';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var id = parseInt(req.params.id, 10);
    var idQuestionary = parseInt(req.params.idQuestionary, 10);
    var data = req.body;

    // validación si existen registros para el usuario y examen
    var queryNumRegistries = 'SELECT COUNT(*) AS `num_registries` FROM `registry` WHERE `user` = ? AND `questionary` = ?';
    pool.query(queryNumRegistries, [id, idQuestionary], function (error, resultNumRegistries) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        if (resultNumRegistries[0]['num_registries'] > 0) {
            return res.status(422).send({'registries':['El usuario ya ha realizado el examen/encuesta']});
        }

        // validación si el usuario puede hacer el examen por pertenecer a uno de sus grupos
        var queryValidQuestionnaires = 'SELECT `id` '+
            'FROM `questionary` '+
            'WHERE '+
                '`group` IN (SELECT distinct(`group`) FROM `user_group` WHERE `user` = ?) AND '+
                '`active` = ?';
        pool.query(queryValidQuestionnaires, [id, 1], function (error, resultValidQuestionnaires) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            var validQuestionnaires = [];

            for (var i=0; i<resultValidQuestionnaires.length; i++) {
                validQuestionnaires.push(resultValidQuestionnaires[i]['id']);
            }

            if (validQuestionnaires.indexOf(idQuestionary) === -1) {
                return res.status(422).send({'registries':['El usuario no tiene permisos para realizar el examen/encuesta']});
            }

            // cargamos las preguntas y respuestas válidas
            var validQuestions = [];
            var validAnswers = {};
            var queryQuestions = 'SELECT '+
                    'q.`id` AS `question_id`,'+
                    'a.`id` AS `answer_id` '+
                'FROM '+
                    '`question` AS q '+
                    'INNER JOIN `answer` AS a ON a.`question` = q.`id` '+
                'WHERE '+
                    'q.`questionary` = ? '+
                'ORDER BY '+
                    'q.`id`, a.`id`';
            pool.query(queryQuestions, [idQuestionary], function (error, resultQuestions) {
                if (error) {
                    return res.status(500).send({
                        'error':error
                    });
                }

                for (var i=0; i<resultQuestions.length; i++) {
                    if (validQuestions.indexOf(resultQuestions[i]['question_id']) === -1) {
                        validQuestions.push(resultQuestions[i]['question_id']);
                    }
                    if (typeof validAnswers[resultQuestions[i]['question_id']] === 'undefined') {
                        validAnswers[resultQuestions[i]['question_id']] = [];
                    }
                    validAnswers[resultQuestions[i]['question_id']].push(resultQuestions[i]['answer_id']);
                }

                // validaciones formato
                var registries = data['registries'];
                var errors = config.validateRegistries(registries, validQuestions, validAnswers);

                if (errors.length > 0) {
                    return res.status(422).send({'registries': errors});
                }

                // realizamos insert
                var insertRegistries = 'INSERT INTO `registry` (`user`,`questionary`,`question`,`answer`) VALUES ?';
                var toInsert = [];

                for (var i=0; i<registries.length; i++) {
                    toInsert.push([id, idQuestionary, registries[i]['question'], registries[i]['answer']]);
                }

                pool.query(insertRegistries, [toInsert], function (error, result) {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({
                            'error':['Los datos no han podido ser creados']
                        });
                    }

                    return res.status(201).send(data);
                });
            });
        });
    });
};