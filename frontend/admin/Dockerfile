FROM node:18

ENV NODE_ENV = "production"

RUN mkdir /admin
WORKDIR /admin

COPY package.json package-lock.json* ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npx remix vite:build