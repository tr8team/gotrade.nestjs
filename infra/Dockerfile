FROM node:18-alpine as builder-base
RUN npm i -g pnpm

FROM builder-base as builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i
COPY . .
RUN rm config/app/*.config.yaml
ENV PATH "$PATH:/app/node_modules/.bin"
RUN nest build


FROM builder-base as packages
WORKDIR /app
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i --prod

FROM node:18-alpine
ARG UID=10001
ARG GID=10001
RUN addgroup -g "${GID}" node-user && adduser -D -u "${UID}" -G node-user node-user
USER node-user
WORKDIR /app
COPY --chown=node-user --from=packages /app/node_modules /app/node_modules
COPY --chown=node-user --from=builder /app/dist /app/dist
COPY --chown=node-user ./package.json ./package.json
COPY --chown=node-user --from=packages /app/pnpm-lock.yaml /app/pnpm-lock.yaml
CMD ["node", "dist/src/main"]
