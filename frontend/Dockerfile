FROM node:latest

WORKDIR /app/

COPY ./frontend/package.json /app/
COPY ./frontend/package-lock.json /app/


RUN rm -rf node_modules \
    && npm cache clean --force \
    && npm install --no-cache