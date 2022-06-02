/* eslint-disable max-len */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const fs = require("fs");
const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");

require("dotenv").config();

const Config = require("./global/configs/config");
const Logger = require("./global/loggers/logger");
const AutomationConfig = require("./school/hust/automation/configs/config");

const SchoolClassRouter = require("./school/hust/register-preview/routes/school-class.router");
const EntryRouter = require("./school/hust/automation/routes/entry.router");
const MongoDBClient = require("./global/clients/mongodb.client");

const EntryStatus = require("./school/hust/automation/configs/entry-status");
const auth = require("./global/middlewares/auth");
const schoolAutomationRateLimit = require("./school/hust/automation/middlewares/rate-limit");
const EntryController = require("./school/hust/automation/controllers/entry.controller");
const loopAsync = require("./global/controllers/loop-async");
const IOCContainer = require("./global/libs/ioc-container");
const ServerUtils = require("./global/utils/server.utils");
const SchoolClassController = require("./school/hust/register-preview/controllers/school-class.controller");
const Validation = require("./global/validations/validation");
const ArrayValidation = require("./global/validations/array.validation");
const DateTimeUtils = require("./global/utils/datetime.utils");
const StringDTO = require("./global/dto/string.dto");
const SemesterValidation = require("./school/hust/register-preview/validations/semester.validation");
const SchoolClassDTO = require("./school/hust/register-preview/dto/school-class.dto");
const EntryValidation = require("./school/hust/automation/validations/entry.validation");
const EntryDTO = require("./school/hust/automation/dto/entry.dto");
const PuppeteerManager = require("./school/hust/automation/controllers/puppeteer.manager");
const JobRunner = require("./school/hust/automation/controllers/job.runner");
const JobValidation = require("./school/hust/automation/validations/job.validatation");
const NumberDTO = require("./global/dto/number.dto");

async function main() {
    const ioc = new IOCContainer();

    ioc.addZeroDependencyBean("iocContainer", ioc);
    ioc.addZeroDependencyBean("ioc", ioc);
    ioc.addClassInfo("CONFIG", Config);
    ioc.addClassInfo("AUTOMATION_CONFIG", AutomationConfig);
    ioc.addClassInfo("validation", Validation);
    ioc.addClassInfo("arrayValidation", ArrayValidation);
    ioc.addClassInfo("datetimeUtils", DateTimeUtils);
    ioc.addClassInfo("stringDTO", StringDTO);
    ioc.addClassInfo("numberDTO", NumberDTO);
    ioc.addClassInfo("semesterValidation", SemesterValidation);
    ioc.addClassInfo("schoolClassDTO", SchoolClassDTO);
    ioc.addClassInfo("entryDTO", EntryDTO);
    ioc.addClassInfo("logger", Logger, [], ["handler", "handlers"]);
    ioc.addClassInfo("mongodbClient", MongoDBClient);
    ioc.addClassInfo("serverUtils", ServerUtils);
    ioc.addClassInfo("entryController", EntryController);
    ioc.addClassInfo("entryRouter", EntryRouter);
    ioc.addClassInfo("schoolClassRouter", SchoolClassRouter);
    ioc.addClassInfo("schoolClassController", SchoolClassController);
    ioc.addClassInfo("entryValidation", EntryValidation);
    ioc.addClassInfo("puppeteerManager", PuppeteerManager);
    ioc.addClassInfo("jobRunner", JobRunner);
    ioc.addClassInfo("jobValidation", JobValidation);

    ioc.startup();

    const CONFIG = ioc.beanPool.get("CONFIG").instance;
    CONFIG.loadFromEnv(process.env);
    const AUTOMATION_CONFIG = ioc.beanPool.get("AUTOMATION_CONFIG").instance;
    AUTOMATION_CONFIG.loadFromEnv(process.env);
    const logger = ioc.beanPool.get("logger").instance;
    const mongodbClient = ioc.beanPool.get("mongodbClient").instance;
    const entryRouter = ioc.beanPool.get("entryRouter").instance;
    const classRouter = ioc.beanPool.get("schoolClassRouter").instance;
    const puppeteerManager = ioc.beanPool.get("puppeteerManager").instance;
    const jobRunner = ioc.beanPool.get("jobRunner").instance;
    const entryController = ioc.beanPool.get("entryController").instance;

    // make sure tmp dir exists
    if (!fs.existsSync(CONFIG.tmp.dir)) {
        fs.mkdirSync(CONFIG.tmp.dir);
    }

    // init puppeteer
    logger.info(`launchOption: ${JSON.stringify(CONFIG.puppeteer.launchOption, null, 2)}`);
    await puppeteerManager.launch(CONFIG.puppeteer.launchOption);
    await puppeteerManager
        .getBrowser()
        .pages() // lúc thực thi có thể có một số trang web sử dụng alert, dialog thì chỉ cần accept
        .then((pages) => pages.forEach((page) => page.on("dialog", (dialog) => dialog.accept())));

    // init logger
    logger.use(CONFIG.log.dest);
    logger.info(`log.dest: ${CONFIG.log.dest}`);

    // init database
    logger.info(`mongodb.connectionString: ${CONFIG.mongodb.connectionString}`);
    await mongodbClient.prepare(CONFIG.mongodb.connectionString);
    mongodbClient.getClassesCollection().createIndex({ MaLop: 1 }); // init collection index for search faster

    // can start process entry
    logger.info(`automation.repeatProcessAfter: ${AUTOMATION_CONFIG.repeatProcessAfter}`);
    loopAsync.loopInfinity(async () => {
        // phải sử dụng chung tab vì nếu 2 tab cùng mở ctt-sis sẽ đánh nhau
        // phải cùng loop với execute vì nếu không cũng sẽ đánh nhau
        const entriesCollection = mongodbClient.getEntriesCollection();
        try {
            // gọi check real account trước
            const cursor = entriesCollection.find({
                "timeToStart.n": {
                    $lt: Date.now(), // thời gian sắp tới
                },
                status: EntryStatus.READY,
            });
            // eslint-disable-next-line no-await-in-loop
            while (await cursor.hasNext()) {
                // eslint-disable-next-line no-await-in-loop
                const entry = await cursor.next();
                const job = require(AUTOMATION_CONFIG.jobMappers.get(entry.actionId));
                // eslint-disable-next-line no-await-in-loop
                const result = await jobRunner.run(job, entry);
                entryController.processResult(result);
            }
        } catch (err) {
            // có thể lỗi mất mạng
            logger.error(err);
        }
    }, AUTOMATION_CONFIG.repeatProcessAfter);

    // init server
    const server = express();

    // enable cors
    logger.info(`security.cors: ${CONFIG.security.cors}`);
    if (CONFIG.security.cors) {
        server.use(cors());
    }

    // init handlers
    server.use(express.json());
    server.use(express.static(CONFIG.static, { maxAge: String(7 * 24 * 60 * 60 * 1000) /* 7 day */ }));

    // school/automation
    server.get("/api/school/hust/automation/entries", entryRouter.find);
    server.post("/api/school/hust/automation/entries", schoolAutomationRateLimit.submitEntry, entryRouter.insert);
    server.post("/api/school/hust/automation/entries", entryRouter.find);
    server.put("/api/school/hust/automation/entries/:entryId", entryRouter.update);

    // school/register-preview
    server.get("/api/school/hust/register-preview/classes", classRouter.find);
    server.post("/api/school/hust/register-preview/classes", auth.isCorrectSecret(CONFIG.security.secret), classRouter.insert);
    server.delete("/api/school/hust/register-preview/classes", auth.isCorrectSecret(CONFIG.security.secret), classRouter.drop);

    // create server
    if (CONFIG.ssl.enabled) {
        // https
        logger.info(`bind: https://${CONFIG.bind}:${CONFIG.port}`);
        https.createServer({
            key: fs.readFileSync(CONFIG.ssl.key),
            cert: fs.readFileSync(CONFIG.ssl.cert),
        }, server).listen(CONFIG.port, CONFIG.bind);
    } else {
        // http
        logger.info(`bind: http://${CONFIG.bind}:${CONFIG.port}`);
        http.createServer(server).listen(CONFIG.port, CONFIG.bind);
    }
}

main();
