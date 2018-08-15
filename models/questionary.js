var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'questionary',
    'publicColumns':['id', 'group', 'title', 'description', 'model', 'created_at', 'updated_at', 'public', 'active'],
    'rulesForListing':{
        'group':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('group', 'id', 'group')
            }
        },
        'model':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('questionary_model', 'id', 'model')
            }
        },
        'public':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'public')
            }
        },
        'active':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'active')
            }
        }
    },
    'rulesForCreate':{
        'group':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'group')
            },
            'custom':{
                'options': utilities.existsInDb('group', 'id', 'group')
            }
        },
        'title':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'title')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'title', {min:2,max:256}),
                'options':{min:2,max:256}
            }
        },
        'description':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'description', {max:65535}),
                'options':{max:65535}
            }
        },
        'model':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'model')
            },
            'custom':{
                'options': utilities.existsInDb('questionary_model', 'id', 'model')
            }
        },
        'public':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'public')
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'public')
            }
        },
        'active':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'active')
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'active')
            }
        }
    },
    'rulesForUpdate':{
        'title':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'title', {min:2,max:256}),
                'options':{min:2,max:256}
            }
        },
        'description':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'description', {max:65535}),
                'options':{max:65535}
            }
        },
        'public':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'public')
            }
        },
        'active':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'active')
            }
        }
    },
    'relations':null,
    'checkAcl':function(req, route){
        switch (route) {
            case 'questionary.listing':
            case 'questionary.read':
                if (['administrator', 'instructor', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'questionary.create':
            case 'questionary.update':
            case 'questionary.delete':
            case 'questionary.readComplete':
            case 'questionary.addQuestions':
                if (['instructor'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;

            default:
                return false;
        }

        return true;
    },
    'validateQuestions':function(questions){
        var errors = [];
        var q, a;

        if (typeof questions === 'undefined') {
            return ['The questions field is required.'];
        }

        if (questions.constructor !== Array) {
            return ['The questions must be an array.'];
        }

        if (questions.length === 0) {
            return ['The questions field is required.'];
        }

        for (var i=0; i<questions.length; i++) {
            q = questions[i];

            if (typeof q !== 'object') {
                errors.push('Error en pregunta #'+(i+1)+': la pregunta debe ser un objeto');
                continue;
            }

            if (!q.hasOwnProperty('statement') || (q.hasOwnProperty('statement') && (q['statement'] === '' || q['statement'] === null))) {
                errors.push('Error en pregunta #'+(i+1)+': el enunciado es obligatorio');
            }

            if (!q.hasOwnProperty('model') || (q.hasOwnProperty('model') && !(q['model'] > 0))) {
                errors.push('Error en pregunta #'+(i+1)+': el tipo no es válido');
            }

            if (!q.hasOwnProperty('sort') || (q.hasOwnProperty('sort') && !(q['sort'] > 0))) {
                errors.push('Error en pregunta #'+(i+1)+': el orden no es válido');
            }

            if (!q.hasOwnProperty('answers') || (q.hasOwnProperty('answers') && (q['answers'].constructor !== Array))) {
                errors.push('Error en pregunta #'+(i+1)+': el formato de las respuestas no es válido');
            }

            if (q.hasOwnProperty('answers') && (q['answers'].constructor === Array)) {
                if (q['answers'].length < 2) {
                    errors.push('Error en pregunta #'+(i+1)+': debe indicar como mínimo 2 respuestas');
                }

                if (q['answers'].length > 4) {
                    errors.push('Error en pregunta #'+(i+1)+': debe indicar como máximo 4 respuestas');
                }

                var numCorrectAnswers = 0;
                for (var j=0; j<q['answers'].length; j++) {
                    a = q['answers'][j];

                    if (typeof a !== 'object') {
                        errors.push('Error en pregunta #'+(i+1)+', respuesta #'+(j+1)+': la respuesta debe ser un objeto');
                        continue;
                    }

                    if (!a.hasOwnProperty('statement') || (a.hasOwnProperty('statement') && (a['statement'] === '' || a['statement'] === null))) {
                        errors.push('Error en pregunta #'+(i+1)+', respuesta #'+(j+1)+': el texto es obligatorio');
                    }

                    if (!a.hasOwnProperty('correct') || (a.hasOwnProperty('correct') && a['correct'] !== 0 && a['correct'] !== 1)) {
                        errors.push('Error en pregunta #'+(i+1)+', respuesta #'+(j+1)+': la respuesta correcta no es válida');
                    }

                    if (a.hasOwnProperty('correct') && a['correct'] === 1) {
                        numCorrectAnswers++;
                    }
                }

                if (numCorrectAnswers === 0) {
                    errors.push('Error en pregunta #'+(i+1)+': no se ha indicado ninguna respuesta correcta');
                }

                if (numCorrectAnswers > 1) {
                    errors.push('Error en pregunta #'+(i+1)+': se ha indicado más de 1 respuesta correcta');
                }
            }
        }

        return errors;
    }
};