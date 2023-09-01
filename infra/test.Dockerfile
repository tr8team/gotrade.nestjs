FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache bash==5.2.15-r5 && npm i -g pnpm

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i
ENV PATH "$PATH:/app/node_modules/.bin"
COPY . .
RUN rm config/app/*.config.yaml && nest build
CMD ["./scripts/start_test.sh"]
