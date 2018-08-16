var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'registry',
    'publicColumns':['id', 'user', 'questionary', 'question', 'answer', 'created_at'],
    'rulesForListing':{
        'user':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('user', 'id', 'user')
            }
        },
        'questionary':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('questionary', 'id', 'questionary')
            }
        },
        'question':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('question', 'id', 'question')
            }
        },
        'answer':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('answer', 'id', 'answer')
            }
        }
    },
    'rulesForCreate':{
        'user':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('user', 'id', 'user')
            }
        },
        'questionary':{
            'in': ['query'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'questionary')
            },
            'custom':{
                'options': utilities.existsInDb('questionary', 'id', 'questionary')
            }
        },
        'question':{
            'in': ['query'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'question')
            },
            'custom':{
                'options': utilities.existsInDb('question', 'id', 'question')
            }
        },
        'answer':{
            'in': ['query'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'answer')
            },
            'custom':{
                'options': utilities.existsInDb('answer', 'id', 'answer')
            }
        }
    },
    'rulesForUpdate':{},
    'relations':null,
    'checkAcl':function(req, route){
        switch (route) {
            case 'registry.listing':
            case 'registry.read':
                if (['administrator', 'instructor'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'registry.saveAttempt':
                if (['user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                if (req.appUser.role === 'user' &&  req.appUser.id !== parseInt(req.params.id, 10)) {
                    return false;
                }
                break;
            case 'registry.create':
            case 'registry.update':
            case 'registry.delete':
                break;

            default:
                return false;
        }

        return true;
    },
    'validateRegistries':function(registries, validQuestions, validAnswers){
        var errors = [];
        var questionsSent = [];
        var r;

        if (typeof registries === 'undefined') {
            return ['The registries field is required.'];
        }

        if (registries.constructor !== Array) {
            return ['The registries must be an array.'];
        }

        if (registries.length === 0) {
            return ['The registries field is required.'];
        }

        for (var i=0; i<registries.length; i++) {
            r = registries[i];

            if (typeof r !== 'object') {
                errors.push('Error en registro #'+(i+1)+': el registro debe ser un objeto');
                continue;
            }

            if (!r.hasOwnProperty('question') || (r.hasOwnProperty('question') && validQuestions.indexOf(r['question']) === -1)) {
                errors.push('Error en registro #'+(i+1)+': la pregunta no es válida');
                continue;
            } else {
                if (questionsSent.indexOf(r['question']) !== -1) {
                    errors.push('Error en registro #'+(i+1)+': ya estás enviando un registro para la misma pregunta');
                } else {
                    questionsSent.push(r['question']);
                }
            }

            if (!r.hasOwnProperty('answer') || (r.hasOwnProperty('answer') && validAnswers[r['question']].indexOf(r['answer']) === -1)) {
                errors.push('Error en registro #'+(i+1)+': la respuesta no es válida');
            }
        }

        if (errors.length === 0 && questionsSent.length !== validQuestions.length) {
            errors.push('Faltan preguntas por responder');
        }

        return errors;
    }
};