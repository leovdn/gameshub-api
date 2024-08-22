FROM node:18

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json yarn.lock ./
RUN yarn config set network-timeout 600000 -g && yarn install

WORKDIR /opt/app
COPY . .
ENV PATH /opt/node_modules/.bin:$PATH
RUN chown -R node:node /opt/app
USER node
RUN ["yarn", "build"]
EXPOSE 1337
CMD ["yarn", "develop"]
