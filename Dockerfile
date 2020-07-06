# syntax = docker/dockerfile:1.0-experimental

###########################################################

FROM node:11.13-slim as run-base

ENV HOME=/root
WORKDIR $HOME

COPY package.json yarn.lock $HOME/

RUN apt update -y && \
    yarn install --production --pure-lockfile && \


###########################################################


FROM node:11.13-slim as build-env

ENV HOME=/root

COPY package.json yarn.lock $HOME/
WORKDIR $HOME

RUN apt update -y && \
    yarn install && \

COPY tsconfig.prod.json $HOME/tsconfig.json
COPY src $HOME/src

RUN yarn build

###########################################################

FROM run-base

ENV HOME=/root
WORKDIR $HOME

COPY config $HOME/config

COPY --from=build-env $HOME/dist $HOME/dist

EXPOSE 8080

CMD NODE_ENV=${NODE_ENV} yarn start
