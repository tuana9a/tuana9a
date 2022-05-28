/* eslint-disable max-len */
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");

require("dotenv").config();

const CONFIG = require("./global/configs/config");
const Logger = require("./global/loggers/logger");
const AUTOMATION_CONFIG = require("./school/hust/automation/configs/config");

const SchoolClassRouter = require("./school/hust/register-preview/routes/school-class.router");
const EntryRouter = require("./school/hust/automation/routes/entry.router");
const MongoDBClient = require("./global/clients/mongodb.client");

const EntryStatus = require("./school/hust/automation/configs/entry-status");
const requireCorrectSecretHeader = require("./global/middlewares/require-secret-correct-header");
const schoolAutomationRateLimit = require("./school/hust/automation/middlewares/rate-limit");
const EntryController = require("./school/hust/automation/controllers/entry.controller");
const loopAsync = require("./global/controllers/loop-async");
const IOCContainer = require("./global/libs/ioc-container");
const ServerUtils = require("./global/utils/server.utils");
const SchoolClassController = require("./school/hust/register-preview/controllers/school-class.controller");
const validation = require("./global/validations/validation");
const arrayValidation = require("./global/validations/array.validation");
const datetimeUtils = require("./global/utils/datetime.utils");
const stringDTO = require("./global/dto/string.dto");
const semesterValidation = require("./school/hust/register-preview/validations/semester.validation");
const schoolClassDTO = require("./school/hust/register-preview/dto/school-class.dto");
const EntryValidation = require("./school/hust/automation/validations/entry.validation");
const entryDTO = require("./school/hust/automation/dto/entry.dto");
const PuppeteerManager = require("./school/hust/automation/controllers/puppeteer.manager");
const JobRunner = require("./school/hust/automation/controllers/job.runner");
const JobValidation = require("./school/hust/automation/validations/job.validatation");

async function main() {
    const ioc = new IOCContainer();
    ioc.addZeroDependencyBean({ name: "CONFIG", instance: CONFIG });
    ioc.addZeroDependencyBean({ name: "AUTOMATION_CONFIG", instance: AUTOMATION_CONFIG });
    ioc.addZeroDependencyBean({ name: "validation", instance: validation });
    ioc.addZeroDependencyBean({ name: "arrayValidation", instance: arrayValidation });
    ioc.addZeroDependencyBean({ name: "datetimeUtils", instance: datetimeUtils });
    ioc.addZeroDependencyBean({ name: "stringDTO", instance: stringDTO });
    ioc.addZeroDependencyBean({ name: "semesterValidation", instance: semesterValidation });
    ioc.addZeroDependencyBean({ name: "schoolClassDTO", instance: schoolClassDTO });
    ioc.addZeroDependencyBean({ name: "entryDTO", instance: entryDTO });
    // eslint-disable-next-line object-curly-newline
    ioc.addClassInfo({ name: "logger", Classs: Logger, ignoreDep: ["handler", "handlers"], autowired: true });
    ioc.addClassInfo({ name: "mongodbClient", Classs: MongoDBClient, autowired: true });
    ioc.addClassInfo({ name: "serverUtils", Classs: ServerUtils, autowired: true });
    ioc.addClassInfo({ name: "entryController", Classs: EntryController, autowired: true });
    ioc.addClassInfo({ name: "entryRouter", Classs: EntryRouter, autowired: true });
    ioc.addClassInfo({ name: "schoolClassRouter", Classs: SchoolClassRouter, autowired: true });
    ioc.addClassInfo({ name: "schoolClassController", Classs: SchoolClassController, autowired: true });
    ioc.addClassInfo({ name: "entryValidation", Classs: EntryValidation, autowired: true });
    ioc.addClassInfo({ name: "puppeteerManager", Classs: PuppeteerManager, autowired: true });
    ioc.addClassInfo({ name: "jobRunner", Classs: JobRunner, autowired: true });
    ioc.addClassInfo({ name: "jobValidation", Classs: JobValidation, autowired: true });

    await ioc.startup();

    const logger = ioc.beanPool.get("logger").instance;
    const mongodbClient = ioc.beanPool.get("mongodbClient").instance;
    const entryRouter = ioc.beanPool.get("entryRouter").instance;
    const classRouter = ioc.beanPool.get("schoolClassRouter").instance;
    const puppeteerManager = ioc.beanPool.get("puppeteerManager").instance;
    const jobRunner = ioc.beanPool.get("jobRunner").instance;
    const entryController = ioc.beanPool.get("entryController").instance;

    // make sure tmp dir exists
    if (!fs.existsSync(CONFIG.tmpDir)) {
        fs.mkdirSync(CONFIG.tmpDir);
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
                const job = AUTOMATION_CONFIG.jobMappers.get(entry.actionId);
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
    logger.info(`allowCors: ${CONFIG.allowCors}`);
    if (CONFIG.allowCors) {
        server.use(cors());
    }

    // init handlers
    server.use(express.json());
    server.use(express.static(CONFIG.static, { maxAge: String(7 * 24 * 60 * 60 * 1000) /* 7 day */ }));

    // school/automation
    server.get("/api/school/hust/automation/entry", entryRouter.find);
    server.post("/api/school/hust/automation/entry", schoolAutomationRateLimit.submitEntry, entryRouter.insert);
    server.post("/api/school/hust/automation/getEntries", entryRouter.find);
    server.put("/api/school/hust/automation/entry/:entryId", entryRouter.update);

    // school/register-preview
    server.get("/api/school/hust/register-preview/classes", classRouter.find);
    server.post("/api/school/hust/register-preview/classes", requireCorrectSecretHeader, classRouter.insert);
    server.delete("/api/school/hust/register-preview/classes", requireCorrectSecretHeader, classRouter.drop);

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
