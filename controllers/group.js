var baseController = require('./base.js');
var config = {
    'table':'group',
    'publicColumns':['id', 'name', 'description', 'created_at', 'updated_at', 'active'],
    'rulesForListing':[],
    'rulesForCreate':[],
    'rulesForUpdate':[],
    'relations':{
        'instructor':{
            'join':{
                'table':'instructor_group',
                'publicColumns':['added_at'],
                'fkColumn':'instructor',
                'whereColumn':'group'
            },
            'publicColumns':['id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active']
        },
        'user':{
            'join':{
                'table':'user_group',
                'publicColumns':['added_at'],
                'fkColumn':'user',
                'whereColumn':'group'
            },
            'publicColumns':['id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active']
        }
    }
};
var pool = require('../modules/database');

module.exports.listing = baseController.listing(config);
module.exports.read = baseController.read(config);
module.exports.create = baseController.create(config);
module.exports.update = baseController.update(config);
module.exports.delete = baseController.delete(config);
module.exports.listingInstructor = baseController.listingRelation(config.relations.instructor, 'instructor');
module.exports.listingUser = baseController.listingRelation(config.relations.user, 'user');

module.exports.currentInstructor = function(req, res, next) {
    var data = req.body;
    var id = req.params.id;
    var query = 'SELECT `id`, `instructor` FROM `instructor_group` WHERE `group` = ?';
    var currentIds = [], toDelete = [], toInsert = [];

    pool.query(query, [id], function (error, currentState, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        currentState.forEach(function(current) {
            currentIds.push(current.instructor);
            if (data.instructor.indexOf(current.instructor) === -1) {
                toDelete.push(current.id);
            }
        });

        data.instructor.forEach(function(value) {
            if (currentIds.indexOf(value) === -1) {
                toInsert.push([id, value]);
            }
        });

        var step3 = function(){
            return baseController.listingRelation(config.relations.instructor, 'instructor')(req, res, next);
        };
        var step2 = function(){
            if (toInsert.length > 0) {
                pool.query('INSERT INTO `instructor_group`(`group`, `instructor`) VALUES ?', [toInsert], function (error, results, fields) {
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

module.exports.currentUser = function(req, res, next) {
    var data = req.body;
    var id = req.params.id;
    var query = 'SELECT `id`, `user` FROM `user_group` WHERE `group` = ?';
    var currentIds = [], toDelete = [], toInsert = [];

    pool.query(query, [id], function (error, currentState, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        currentState.forEach(function(current) {
            currentIds.push(current.user);
            if (data.user.indexOf(current.user) === -1) {
                toDelete.push(current.id);
            }
        });

        data.user.forEach(function(value) {
            if (currentIds.indexOf(value) === -1) {
                toInsert.push([id, value]);
            }
        });

        var step3 = function(){
            return baseController.listingRelation(config.relations.user, 'user')(req, res, next);
        };
        var step2 = function(){
            if (toInsert.length > 0) {
                pool.query('INSERT INTO `user_group`(`group`, `user`) VALUES ?', [toInsert], function (error, results, fields) {
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