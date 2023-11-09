FROM node:18-alpine as builder
WORKDIR /opt/customer-api

COPY . /opt/customer-api

RUN npm ci
RUN npm run clean && \
    npm run build

FROM node:18-alpine

RUN apk --no-cache add ca-certificates

WORKDIR /opt/customer-api

ENV DOCKERIZE_VERSION v0.7.0
RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

COPY --from=builder /opt/customer-api .

EXPOSE 3000

ENTRYPOINT ["node", "./dist/src/main.js"]
