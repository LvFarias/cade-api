FROM node:15-alpine

WORKDIR /app/

COPY ./src .

RUN rm -rf ./node_modules

RUN npm install

EXPOSE 23274

ENTRYPOINT ["npm", "run", "prod"]