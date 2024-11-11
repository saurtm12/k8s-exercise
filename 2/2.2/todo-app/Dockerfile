FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci

COPY . .

COPY public /usr/src/app/default-public

ENTRYPOINT ["sh", "-c", "cp -r /usr/src/app/default-public/* /usr/src/app/public/ && node index.js"]
