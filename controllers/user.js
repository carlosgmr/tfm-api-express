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