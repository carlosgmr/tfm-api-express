FROM carlosgmr/node8.11

LABEL maintainer="Carlos Molina <cmolinaronceros@gmail.com>"

### Copiamos proyecto a contenedor ###
COPY . /home/node/app
### Instalamos dependencias ###
RUN cd /home/node/app && npm install

### Arrancamos aplicación ###
CMD ["npm", "start"]
