FROM node:18-alpine as builder
WORKDIR /opt/challenge-pagaleve-api
COPY . /opt/challenge-pagaleve-api
RUN npm ci
RUN npm run clean
RUN npm run build

FROM node:18-alpine  
RUN apk --no-cache add ca-certificates
WORKDIR /opt/challenge-pagaleve-api
COPY --from=builder /opt/challenge-pagaleve-api .
CMD ["node", "dist/src/main.js"]
