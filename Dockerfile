FROM node:alpine

WORKDIR /usr/app/backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]