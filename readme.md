# API REST con Express
Proyecto diseñado para mi TFM. Consiste en una API REST desarrollada sobre la
plataforma [NodeJS 8.11](https://nodejs.org/es/docs/) utilizando el framework 
[Express 4.16](http://expressjs.com/es/4x/api.html).

## Instalación y despliegue
Para instalar el proyecto hay que seguir los siguientes pasos:

* Clonar o descargar proyecto desde GitHub: `git clone https://github.com/carlosgmr/tfm-api-express.git api-express`
* Entrar en la carpeta del proyecto: `cd api-express`
* Crear el fichero `config.js`. Su contenido será el siguiente:

```javascript
module.exports = {
    'db': {
        'host': '192.168.1.XXX', // IP o nombre de dominio donde se encuentra la base de datos. Importante: Si la base de datos se encuentra en el mismo equipo, no utilizar localhost o 127.0.0.1, sino la IP que tiene el equipo en la red local (utilizad ifconfig para averiguarla)
        'port': 0000, // puerto de conexión con la base de datos
        'user': 'usuario', // nombre de usuario para conectar a la base de datos
        'password': 'contraseña', // contraseña de usuario para conectar a la base de datos
        'database': 'base de datos', // nombre del esquema de la base de datos que se utilizará
        'dateStrings': true
    },
    'jwt':{
        'issuer':'tfm-api-express',
        'secret':'your-secret-key' // cadena aleatoria que se utilizará para firmar los token de autenticación JWT. Se recomienda que tenga una longitud mínima de 32 caracteres y que contega letras en mayúsculas y minúsculas y números
    },
    'passwordAlgo':'sha1|bcrypt' // algoritmo para encriptar las contraseñas de usuario. Los valores admitidos son sha1 y bcrypt. Para compatibilidad total entre clientes web y APIs, utilizad sha1
};
```

* Construir la imagen de Docker: `docker build -t carlosgmr/api-express .`
  Tener en cuenta que hay que estar dentro de la carpeta del proyecto.
* Construir contenedor Docker con la imagen anterior y ejecutarlo: `docker run -p 8971:3000 --detach --memory 1g --name api-express carlosgmr/api-express`
* La aplicación se encuentra accesible desde `http://localhost:8971`