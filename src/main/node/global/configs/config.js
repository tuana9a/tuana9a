/* eslint-disable radix */
const CONFIG = {};

// start assign value
CONFIG.bind = process.env.BIND || "127.0.0.1";
CONFIG.port = parseInt(process.env.PORT) || 80;
CONFIG.static = process.env.STATIC || "src/main/webapp";
CONFIG.docsDir = process.env.DOCS_DIR;

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
CONFIG.mongodb.collectionNames = { // currently hardcode these value
    school: {
        classes: "school.classes",
        automation: {
            entries: "school.automation.entries",
            history: "school.automation.history",
        },
    },
};

// load message queue config
CONFIG.rabbitmq = {};
CONFIG.rabbitmq.connectionString = process.env.RABBITMQ_CONNECTION_STRING;
CONFIG.rabbitmq.queueNames = {
    school: {
        automation: {
            response: "tuana9a.school.automation.response",
        },
    },
};
CONFIG.rabbitmq.exchangeNames = {
    bot: "bot",
};
CONFIG.rabbitmq.topics = {
    submit: "submit",
};

module.exports = CONFIG;
