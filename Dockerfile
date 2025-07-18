FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

CMD ["node", "dist/main.js"]
