FROM node:16-alpine
RUN mkdir /app
COPY . /app/
WORKDIR /app
RUN npm install
ENTRYPOINT node ./deploy-commands.js && node ./index.js