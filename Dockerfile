FROM node:12

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY tsconfig.json ./
COPY src src
COPY styles styles

# remove when jszmq is merged upstream
WORKDIR /usr/src/app/node_modules/jszmq
RUN npm install
RUN npm run build
WORKDIR /usr/src/app
# end remove

RUN yarn build

EXPOSE 3000

ENV NODE_ENV PRODUCTION

CMD [ "yarn", "server" ]
