FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/uploads/posts

EXPOSE 8800

CMD ["node", "index.js"]
