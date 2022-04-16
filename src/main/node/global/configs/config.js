/* eslint-disable radix */
require("dotenv").config();

const CONFIG = {};

// start assign value
CONFIG.bind = process.env.BIND || "127.0.0.1";
CONFIG.port = parseInt(process.env.PORT) || 80;
CONFIG.static = process.env.STATIC || "src/main/webapp";
CONFIG.docsDir = process.env.DOCS_DIR;

// config logging
CONFIG.log = {};
CONFIG.log.handlerName = process.env.LOG_DESTINATION;

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
CONFIG.database = {};
CONFIG.database.connectionString = process.env.MONGODB_CONNECTION_STRING;
CONFIG.database.name = process.env.MONGODB_DATABASE_NAME;
CONFIG.database.readLimit = parseInt(process.env.MONGODB_READ_LIMIT) || 20;

// config automation
CONFIG.automation = {};
CONFIG.automation.captchaToTextEndpoint = process.env.CAPTCHA_TO_TEXT_ENDPOINT;
// eslint-disable-next-line max-len
CONFIG.automation.repeatProcessAfter = parseInt(process.env.REPEAT_PROCESS_ENTRY_AFFER) || 15000; // default 15s repeat process
CONFIG.automation.maxTryCount = parseInt(process.env.MAX_TRY_COUNT) || 10;
CONFIG.automation.maxTryCaptchaCount = parseInt(process.env.MAX_TRY_CAPTCHA_COUNT) || 10;

CONFIG.automation.bot = {};
CONFIG.automation.bot.url = process.env.BOT_URL;
CONFIG.automation.bot.secret = process.env.BOT_SECRET;

module.exports = CONFIG;
