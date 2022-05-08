FROM node:16-slim

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install --only=production

COPY src/main/node/ src/

COPY static.local/ static.local/

CMD ["node", "src/index.js"]