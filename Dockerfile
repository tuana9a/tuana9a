FROM node:16-slim

WORKDIR /app

# Install puppeteer so it's available in the container.
COPY package.json .

COPY package-lock.json .

RUN npm install --only=production

COPY src/main/node/ src/

COPY static.local/ static.local/

COPY views/ views/

CMD ["node", "src/index.js"]