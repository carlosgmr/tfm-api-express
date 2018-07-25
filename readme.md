# API REST con Express
Proyecto diseñado para mi TFM. Consiste en una API REST desarrollada sobre la
plataforma *NodeJS* utilizando el framework *Express*.

## Desplegar aplicación
Es necesario crear el fichero `config.js` en el directorio del proyecto. Su contenido será el siguiente:

```javascript
module.exports = {
    'db': {
        'host': 'IP base de datos',
        'port': 0000,
        'user': 'usuario',
        'password': 'contraseña',
        'database': 'base de datos',
        'dateStrings': true
    }
};
```
