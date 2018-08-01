var baseController = require('./base.js');
var model = require('../models/group');
var config = model.config;
var pool = require('../modules/database');

module.exports.listing = baseController.listing(config, 'group.listing');
module.exports.read = baseController.read(config, 'group.read');
module.exports.create = baseController.create(config, 'group.create');
module.exports.update = baseController.update(config, 'group.update');
module.exports.delete = baseController.delete(config, 'group.delete');
module.exports.listingInstructor = baseController.listingRelation(config, 'instructor', 'group.listing.instructor');
module.exports.listingUser = baseController.listingRelation(config, 'user', 'group.listing.user');

module.exports.currentInstructor = function(req, res, next) {
    var route = 'group.current.instructor';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

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
            return baseController.listingRelation(config, 'instructor', route)(req, res, next);
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
    var route = 'group.current.user';
    // ACL
    if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    }

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
            return baseController.listingRelation(config, 'user', route)(req, res, next);
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