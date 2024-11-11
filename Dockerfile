FROM node:18

WORKDIR /app

COPY . .

COPY .env .env

RUN yarn install

RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

CMD ["yarn", "start"]

