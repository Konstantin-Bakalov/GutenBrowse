FROM node:20-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

EXPOSE 3000