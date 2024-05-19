FROM node:latest

WORKDIR /app/

COPY ./frontend/package*.json /app/

RUN npm install

CMD ["npm", "run", "dev"]