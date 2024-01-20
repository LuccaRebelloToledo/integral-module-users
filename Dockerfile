# Build
FROM node:20.10.0-alpine3.10 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

# Production
FROM node:20.10.0-alpine3.10 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

RUN addgroup app && adduser -S -G app app
USER app

CMD [ "npm", "run", "start" ]