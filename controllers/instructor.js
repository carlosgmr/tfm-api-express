var baseController = require('./base.js');
var model = require('../models/instructor');
var config = model.config;
var pool = require('../modules/database');

module.exports.listing = baseController.listing(config, 'instructor.listing');
module.exports.read = baseController.read(config, 'instructor.read');
module.exports.create = baseController.create(config, 'instructor.create');
module.exports.update = baseController.update(config, 'instructor.update');
module.exports.delete = baseController.delete(config, 'instructor.delete');
module.exports.listingGroup = baseController.listingRelation(config, 'group', 'instructor.listing.group');

module.exports.currentGroup = function(req, res, next) {
    var route = 'instructor.current.group';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var data = req.body;
    var id = req.params.id;
    var query = 'SELECT `id`, `group` FROM `instructor_group` WHERE `instructor` = ?';
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
                pool.query('INSERT INTO `instructor_group`(`instructor`, `group`) VALUES ?', [toInsert], function (error, results, fields) {
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
                pool.query('DELETE FROM `instructor_group` WHERE `id` IN ?', [[toDelete]], function (error, results, fields) {
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

module.exports.listingQuestionary = function(req, res, next) {
    var route = 'instructor.listing.questionary';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

    var id = req.params.id;
    var query = 'SELECT '+
                'q.`id` AS `questionary_id`,'+
                'q.`title` AS `questionary_title`,'+
                'q.`description` AS `questionary_description`,'+
                'q.`created_at` AS `questionary_created_at`,'+
                'q.`updated_at` AS `questionary_updated_at`,'+
                'q.`public` AS `questionary_public`,'+
                'q.`active` AS `questionary_active`,'+
                'qm.`id` AS `questionary_model_id`,'+
                'qm.`name` AS `questionary_model_name`,'+
                'g.`id` AS `group_id`,'+
                'g.`name` AS `group_name` '+
            'FROM '+
                '`questionary` AS q '+
                'INNER JOIN `group` AS g ON q.`group` = g.`id` '+
                'INNER JOIN `questionary_model` AS qm ON q.`model` = qm.`id` '+
            'WHERE '+
                'q.`group` IN ('+
                    'SELECT g.`id` '+
                    'FROM `instructor_group` AS ig INNER JOIN `group` AS g ON ig.`group` = g.`id` '+
                    'WHERE ig.`instructor` = ? '+
                ') '+
            'ORDER BY '+
                'q.`group`,'+
                'q.`id`';
    var bindings = [id];

    pool.query(query, bindings, function (error, items, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        var results = [];
        for (var i=0; i<items.length; i++) {
            results.push({
                'id': items[i]['questionary_id'],
                'title': items[i]['questionary_title'],
                'description': items[i]['questionary_description'],
                'created_at': items[i]['questionary_created_at'],
                'updated_at': items[i]['questionary_updated_at'],
                'public': items[i]['questionary_public'],
                'active': items[i]['questionary_active'],
                'model': {
                    'id': items[i]['questionary_model_id'],
                    'name': items[i]['questionary_model_name']
                },
                'group': {
                    'id': items[i]['group_id'],
                    'name': items[i]['group_name']
                }
            });
        }

        return res.status(200).send(results);
    });
};