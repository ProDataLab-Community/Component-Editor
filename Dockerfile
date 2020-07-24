FROM node:12

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

ENV NODE_ENV production

RUN yarn
RUN yarn global add typescript webpack webpack-cli stylus

COPY tsconfig.json ./
COPY src src
COPY styles styles

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "server" ]
