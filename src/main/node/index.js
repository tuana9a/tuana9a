/* eslint-disable max-len */
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const LOGGER = require("./global/loggers/logger");
const CONFIG = require("./global/configs/config");
const AUTOMATION_CONFIG = require("./school/hust/automation/configs/config");

const schoolClassesRouter = require("./school/hust/register-preview/routes/school-class.router");
const automationEntryRouter = require("./school/hust/automation/routes/entry.router");
const mongodbClient = require("./global/clients/mongodb.client");

const EntryStatus = require("./school/hust/automation/configs/entry-status");
const requireCorrectSecretHeader = require("./global/middlewares/require-secret-correct-header");
const schoolAutomationRateLimit = require("./school/hust/automation/middlewares/rate-limit");
const rabbitmqClient = require("./global/clients/rabbitmq.client");
const entryController = require("./school/hust/automation/controllers/entry.controller");
const loopAsync = require("./global/controllers/loop-async");

async function main() {
    const BOT_EXCHANGE_NAME = "bot";
    const ENTRY_CREATED_TOPIC = "entry.created";
    const AUTOMATION_RESULTS_QUEUE_NAME = "tuana9a:school:automation-results";

    // init logger
    LOGGER.use(CONFIG.log.dest);
    LOGGER.info(`log.dest: ${CONFIG.log.dest}`);

    // init database
    if (CONFIG.mongodb.connectionString) {
        LOGGER.info(`mongodb.connectionString: ${CONFIG.mongodb.connectionString}`);
        await mongodbClient.prepare(CONFIG.mongodb.connectionString);
        // eslint-disable-next-line max-len
        mongodbClient.getClassesCollection().createIndex({ MaLop: 1 }); // init collection index for search faster
    } else {
        LOGGER.warn("mongodb.connectionString is not set");
    }

    // init rabbitmq
    if (CONFIG.rabbitmq.connectionString) {
        LOGGER.info(`rabbitmq.connectionString: ${CONFIG.rabbitmq.connectionString}`);
        await rabbitmqClient.prepare(CONFIG.rabbitmq.connectionString);
        const channel0 = rabbitmqClient.getChannel();
        // prepare response queue for bot to reply to
        await channel0.assertQueue(AUTOMATION_RESULTS_QUEUE_NAME);
        await channel0.prefetch(1);
        await channel0.consume(AUTOMATION_RESULTS_QUEUE_NAME, async (msg) => {
            try {
                const result = JSON.parse(msg.content.toString());
                LOGGER.info(`received automation result: ${JSON.stringify(result.data, null, 2)}`);
                entryController.processResult(result.data, result);
            } catch (err) {
                LOGGER.error(err);
            } finally {
                channel0.ack(msg);
            }
        }, { noAck: false });
    } else {
        LOGGER.warn("rabbitmq.connectionString is not set");
    }

    // can start process entry
    LOGGER.info(`automation.repeatProcessAfter: ${AUTOMATION_CONFIG.repeatProcessAfter}`);
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
                const body = {
                    jobId: AUTOMATION_CONFIG.jobIdMappers.get(entry.actionId),
                    data: entry,
                };
                rabbitmqClient.getChannel().publish(
                    BOT_EXCHANGE_NAME,
                    ENTRY_CREATED_TOPIC,
                    Buffer.from(JSON.stringify(body)),
                    {
                        replyTo: AUTOMATION_RESULTS_QUEUE_NAME,
                    },
                );
            }
        } catch (err) {
            // có thể lỗi mất mạng
            LOGGER.error(err);
        }
    }, AUTOMATION_CONFIG.repeatProcessAfter);

    // init server
    const server = express();

    // enable cors
    LOGGER.info(`allowCors: ${CONFIG.allowCors}`);
    if (CONFIG.allowCors) {
        server.use(cors());
    }

    // init handlers
    server.use(express.json());
    server.use(express.static(CONFIG.static, { maxAge: String(7 * 24 * 60 * 60 * 1000) /* 7 day */ }));

    // school/automation
    server.get("/api/school/hust/automation/entry", automationEntryRouter.find);
    server.post("/api/school/hust/automation/entry", schoolAutomationRateLimit.submitEntry, automationEntryRouter.insert);
    server.put("/api/school/hust/automation/entry/:entryId", automationEntryRouter.update);

    // school/register-preview
    server.get("/api/school/hust/register-preview/classes", schoolClassesRouter.find);
    server.post("/api/school/hust/register-preview/classes", requireCorrectSecretHeader, schoolClassesRouter.insert);
    server.delete("/api/school/hust/register-preview/classes", requireCorrectSecretHeader, schoolClassesRouter.drop);

    // create server
    if (CONFIG.ssl.enabled) {
        // https
        LOGGER.info(`bind: https://${CONFIG.bind}:${CONFIG.port}`);
        https.createServer({
            key: fs.readFileSync(CONFIG.ssl.key),
            cert: fs.readFileSync(CONFIG.ssl.cert),
        }, server).listen(CONFIG.port, CONFIG.bind);
    } else {
        // http
        LOGGER.info(`bind: http://${CONFIG.bind}:${CONFIG.port}`);
        http.createServer(server).listen(CONFIG.port, CONFIG.bind);
    }
}

main();
