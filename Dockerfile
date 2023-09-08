FROM node:18

#crear un directorio para la api
RUN mkdir -p /usr/src/app

#Defino directorio de trabajo
WORKDIR /usr/src/app

COPY    package*.json ./

COPY . .

RUN npm install 

ENV NODE_ENV=docker

EXPOSE 8000

CMD  ["npm" , "run", "start:dock"]
