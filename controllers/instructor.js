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