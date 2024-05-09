FROM node:lts-alpine as build

WORKDIR /build

COPY package*.json .
RUN npm install

COPY src/ src/
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json

RUN npm run build

FROM node:lts-alpine as production

WORKDIR /app

COPY --from=build build/package*.json .

RUN npm ci --omit=dev

COPY --from=build build/dist dist/

CMD ["node", "./dist/shared/infra/http/index.js"]

EXPOSE 4000