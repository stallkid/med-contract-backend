FROM node:11-alpine

WORKDIR /node

COPY . .

RUN npm install --quiet

RUN npm install nodemon -g --quiet

EXPOSE 3000

CMD nodemon -L --watch /server/app.js