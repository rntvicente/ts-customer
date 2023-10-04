FROM node:18-alpine as builder
WORKDIR /opt/challenge-customer-api
COPY . /opt/challenge-customer-api
RUN npm ci
RUN npm run clean
RUN npm run build

FROM node:18-alpine  
RUN apk --no-cache add ca-certificates
WORKDIR /opt/challenge-customer-api
COPY --from=builder /opt/challenge-customer-api .
CMD ["node", "--require", "./dist/src/infra/server/intrumention.js", "./dist/src/main.js"]
