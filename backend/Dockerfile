FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

WORKDIR /app/build

ENV NODE_ENV="production"

CMD ["node", "index.js"]