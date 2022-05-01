FROM node:16-slim

WORKDIR /app

# Install puppeteer so it's available in the container.
COPY package.json .

COPY package-lock.json .

RUN npm install --only=production

COPY src/ src/

COPY static.local/ static.local/

COPY libs/ libs/

COPY views/ views/

CMD ["node", "src/main/node/index.js"]