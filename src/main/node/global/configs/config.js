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

class Config {
    loadFromEnv(env) {
        // start assign value
        this.bind = env.BIND || "127.0.0.1";
        this.port = parseInt(env.PORT) || 80;
        this.static = env.STATIC;
        this.tmpDir = "./tmp";

        // config logging
        this.log = {};
        this.log.dest = env.LOG_DESTINATION;
        this.log.dir = "./logs/"; // hardcode

        // config ssl
        this.ssl = {};
        this.ssl.enabled = parseInt(env.SSL_ENABLED) || 0;
        this.ssl.cert = env.SSL_CERT_PATH;
        this.ssl.key = env.SSL_KEY_PATH;

        // config cors
        this.allowCors = parseInt(env.ALLOW_CORS) || 0;

        // load config security
        this.security = {};
        this.security.secret = env.SECRET;

        // load config database
        this.mongodb = {};
        this.mongodb.connectionString = env.MONGODB_CONNECTION_STRING;
        this.mongodb.name = env.MONGODB_DATABASE_NAME;
        this.mongodb.readLimit = parseInt(env.MONGODB_READ_LIMIT) || 20;

        // automation
        // eslint-disable-next-line max-len
        this.hustCaptchaToTextEndpoint = env.HUST_CAPTCHA_TO_TEXT_ENDPOINT || env.HUST_CAPTCHA2TEXT_ENDPOINT;
        // config puppeteer

        this.puppeteer = {};
        this.puppeteer.launchOption = launchOptionTemplate.get(env.PUPPETEER_MODE) || launchOptionTemplate.get("default");
        if (env.PUPPETEER_EXEC_PATH) {
            this.puppeteer.launchOption.executablePath = env.PUPPETEER_EXEC_PATH;
        }
        if (parseInt(env.PUPPETEER_NO_SANDBOX, 10)) {
            this.puppeteer.launchOption.args = ["--no-sandbox", "--disable-setuid-sandbox"];
        }
    }
}

module.exports = Config;
