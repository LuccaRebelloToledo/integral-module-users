FROM node:20.10.0-alpine3.10

COPY package*.json ./

RUN npm install

COPY . .
CMD [ "npm", "run", "dev" ]