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

COPY --from=build /usr/src/app/LICENSE ./

COPY --from=build /usr/src/app/package*.json ./

COPY --from=build /usr/src/app/dist ./dist

RUN npm install --only=production && npm cache clean --force

RUN addgroup app && adduser -S -G app app
USER app

EXPOSE 4000

RUN npm run migration:run

CMD [ "npm", "run", "start" ]