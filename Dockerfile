FROM node:12-alpine
RUN mkdir /app
COPY . /app/
WORKDIR /app
RUN npm install
CMD ["node ./deploy-commands.js && node ./index.js"]