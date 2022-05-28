/* eslint-disable radix */
const CONFIG = {};

// start assign value
CONFIG.bind = process.env.BIND || "127.0.0.1";
CONFIG.port = parseInt(process.env.PORT) || 80;
CONFIG.static = process.env.STATIC;
CONFIG.tmpDir = "./tmp";

// config logging
CONFIG.log = {};
CONFIG.log.dest = process.env.LOG_DESTINATION;
CONFIG.log.dir = "./logs/"; // hardcode

// config ssl
CONFIG.ssl = {};
CONFIG.ssl.enabled = parseInt(process.env.SSL_ENABLED) || 0;
CONFIG.ssl.cert = process.env.SSL_CERT_PATH;
CONFIG.ssl.key = process.env.SSL_KEY_PATH;

// config cors
CONFIG.allowCors = parseInt(process.env.ALLOW_CORS) || 0;

// load config security
CONFIG.security = {};
CONFIG.security.secret = process.env.SECRET;

// load config database
CONFIG.mongodb = {};
CONFIG.mongodb.connectionString = process.env.MONGODB_CONNECTION_STRING;
CONFIG.mongodb.name = process.env.MONGODB_DATABASE_NAME;
CONFIG.mongodb.readLimit = parseInt(process.env.MONGODB_READ_LIMIT) || 20;

// automation
// eslint-disable-next-line max-len
CONFIG.hustCaptchaToTextEndpoint = process.env.HUST_CAPTCHA_TO_TEXT_ENDPOINT || process.env.HUST_CAPTCHA2TEXT_ENDPOINT;
// config puppeteer
const launchOptionTemplate = new Map();
launchOptionTemplate.set("headless", {
    slowMo: 10,
    defaultViewport: {
        width: 1920,
        height: 1080,
    },
});
launchOptionTemplate.set("visible", {
    headless: false,
    slowMo: 10,
    defaultViewport: null,
});
launchOptionTemplate.set("default", {
    // default run in headless mode
    slowMo: 10,
    defaultViewport: {
        width: 1920,
        height: 1080,
    },
});
CONFIG.puppeteer = {};
CONFIG.puppeteer.launchOption = launchOptionTemplate.get(process.env.PUPPETEER_MODE) || launchOptionTemplate.get("default");
if (process.env.PUPPETEER_EXEC_PATH) {
    CONFIG.puppeteer.launchOption.executablePath = process.env.PUPPETEER_EXEC_PATH;
}
if (parseInt(process.env.PUPPETEER_NO_SANDBOX, 10)) {
    CONFIG.puppeteer.launchOption.args = ["--no-sandbox", "--disable-setuid-sandbox"];
}

module.exports = CONFIG;
