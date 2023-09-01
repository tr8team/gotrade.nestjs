FROM node:18-alpine
WORKDIR /app
RUN npm i -g pnpm
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i
ENV PATH "$PATH:/app/node_modules/.bin"
COPY . .
CMD ["nest", "start", "--watch"]
