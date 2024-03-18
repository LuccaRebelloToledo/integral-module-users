FROM node:lts-alpine as build

WORKDIR /build

COPY package*.json .
RUN npm ci

COPY src/ src/
COPY tsconfig.json tsconfig.json

RUN npm run build

FROM node:lts-alpine as production

WORKDIR /app

COPY --from=build build/package*.json .

RUN npm ci --omit=dev

COPY --from=build build/dist dist/

CMD ["npm", "start"]

EXPOSE 4000