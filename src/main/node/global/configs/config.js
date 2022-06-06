/* eslint-disable array-bracket-spacing */
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
launchOptionTemplate.set("docker", {
    slowMo: 10,
    defaultViewport: {
        width: 1920,
        height: 1080,
    },
    executablePath: "google-chrome-stable",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

class Config {
    constructor(data) {
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                this[key] = value;
            }
        }
    }

    loadFromEnv(env) {
        // start assign value
        this.bind = env.BIND || "0.0.0.0";
        this.port = parseInt(env.PORT) || 8080;
        this.static = env.STATIC || "static.local";
        this.tmp = {};
        this.tmp.dir = "./tmp/";

        // config logging
        this.log = {};
        this.log.dest = env.LOG_DESTINATION || "cs";
        this.log.dir = "./logs/";

        // config ssl
        this.ssl = {};
        this.ssl.enabled = parseInt(env.SSL_ENABLED) || 0;
        this.ssl.cert = env.SSL_CERT_PATH || "";
        this.ssl.key = env.SSL_KEY_PATH || "";

        // security
        this.security = {};
        this.security.secret = env.SECRET || "";
        this.security.cors = parseInt(env.ALLOW_CORS) || 0;

        // database
        this.mongodb = {};
        this.mongodb.connectionString = env.MONGODB_CONNECTION_STRING;
        this.mongodb.databaseName = env.MONGODB_DATABASE_NAME || "tuana9a";
        this.mongodb.readLimit = parseInt(env.MONGODB_READ_LIMIT) || 20;

        // automation
        this.automation = {};
        // TODO: remove below endpoint
        this.automation.hustCaptchaToTextEndpoint = env.HUST_CAPTCHA_TO_TEXT_ENDPOINT // backward compatibility
            || env.HUST_CAPTCHA2TEXT_ENDPOINT // backward compatibility
            || env.AUTOMATION_HUST_CAPTCHA_TO_TEXT_ENDPOINT
            || env.AUTOMATION_HUST_CAPTCHA2TEXT_ENDPOINT;
        this.automation.getCaptchaToTextEndpointsUrl = env.GET_CAPTCHA_TO_TEXT_ENDPOINTS_URL // backward compatibility
            || env.GET_CAPTCHA2TEXT_ENDPOINTS_URL // backward compatibility
            || env.AUTOMATION_GET_CAPTCHA_TO_TEXT_ENDPOINTS_URL
            || env.AUTOMATION_GET_CAPTCHA2TEXT_ENDPOINTS_URL;
        const GET_STUDENT_PROGRAM_ID = "getStudentProgram";
        const GET_STUDENT_TIMETABLE_ID = "getStudentTimetable";
        const AUTO_REGISTER_CLASSES_ID = "autoRegisterClasses";
        this.automation.getStudentProgramId = GET_STUDENT_PROGRAM_ID;
        this.automation.getStudentTimetableId = GET_STUDENT_TIMETABLE_ID;
        this.automation.autoRegisterClassesId = AUTO_REGISTER_CLASSES_ID;
        this.automation.allowedActions = new Set([GET_STUDENT_PROGRAM_ID, GET_STUDENT_TIMETABLE_ID, AUTO_REGISTER_CLASSES_ID]);
        this.automation.repeatProcessAfter = env.REPEAT_PROCESS_ENTRY_AFFER // backward compatibility
            || env.AUTOMATION_REPEAT_PROCESS_ENTRY_AFFER
            || 30_000; // default 30s repeat process
        this.automation.repeatProcessAfter = parseInt(this.automation.repeatProcessAfter);
        this.automation.maxTryCount = env.MAX_TRY_COUNT
            || env.AUTOMATION_MAX_TRY_COUNT
            || 10;
        this.automation.maxTryCount = parseInt(this.automation.maxTryCount);
        this.automation.maxTryCaptchaCount = env.MAX_TRY_CAPTCHA_COUNT // bnackward compatibility
            || env.AUTOMATION_MAX_TRY_CAPTCHA_COUNT
            || 10;
        this.automation.maxTryCaptchaCount = parseInt(this.automation.maxTryCaptchaCount);
        this.automation.jobMappers = new Map();
        this.automation.jobMappers.set(GET_STUDENT_TIMETABLE_ID, "./school/hust/automation/jobs/getStudentTimetable");
        this.automation.jobMappers.set(GET_STUDENT_PROGRAM_ID, "./school/hust/automation/jobs/getStudentProgram");
        this.automation.jobMappers.set(AUTO_REGISTER_CLASSES_ID, "./school/hust/automation/jobs/autoRegisterClasses");

        // puppeteer
        this.puppeteer = {};
        this.puppeteer.launchOption = launchOptionTemplate.get(env.PUPPETEER_MODE) || launchOptionTemplate.get("default");

        // rate limit
        this.ignoreRateLimit = parseInt(env.IGNORE_RATE_LIMIT) || 0;
    }
}

module.exports = Config;
