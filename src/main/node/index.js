/* eslint-disable max-len */
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");

const LOGGER = require("./global/loggers/logger");
const CONFIG = require("./global/configs/config");
const AUTOMATION_CONFIG = require("./school/automation/configs/config");

const schoolClassesRouter = require("./school/register-preview/routes/school-class.router");
const automationEntryRouter = require("./school/automation/routes/entry.router");
const mongodbClient = require("./global/clients/mongodb.client");

const EntryStatus = require("./school/automation/configs/entry-status");
const botClient = require("./global/clients/bot.client");
const faviconUtils = require("./global/utils/favicon.utils");
const requireCorrectSecretHeader = require("./global/middlewares/require-secret-correct-header");
const schoolAutomationRateLimit = require("./school/automation/middlewares/rate-limit");
const rabbitmqClient = require("./global/clients/rabbitmq.client");
const entryController = require("./school/automation/controllers/entry.controller");
const loopAsync = require("./global/controllers/loop-async");

botClient.setJobId(AUTOMATION_CONFIG.actionIds.autoRegisterClasses, "dk-sis.hust.edu.vn/autoRegisterClasses");
botClient.setJobId(AUTOMATION_CONFIG.actionIds.getStudentProgram, "ctt-sis.hust.edu.vn/getStudentProgram");
botClient.setJobId(AUTOMATION_CONFIG.actionIds.getStudentTimetable, "ctt-sis.hust.edu.vn/getStudentTimetable");

async function main() {
    // init logger
    LOGGER.use(CONFIG.log.handlerName);
    // init database
    if (CONFIG.database.connectionString) {
        LOGGER.log({ type: "INFO", data: "connecting to database" });
        await mongodbClient.prepare(CONFIG.database.connectionString);
        // eslint-disable-next-line max-len
        mongodbClient.getClassesCollection().createIndex({ MaLop: 1 }); // init collection index for search faster
    } else {
        LOGGER.log({ type: "WARN", data: "no database config found" });
    }
    if (CONFIG.rabbitmq.connectionString) {
        LOGGER.log({ type: "INFO", data: "connecting to message queue" });
        await rabbitmqClient.prepare(CONFIG.rabbitmq.connectionString);
        const channel0 = rabbitmqClient.channel;
        // prepare response queue for bot to reply to
        await channel0.assertQueue(CONFIG.rabbitmq.queueNames.school.automation.response);
        await channel0.prefetch(1);
        await channel0.consume(CONFIG.rabbitmq.queueNames.school.automation.response, async (msg) => {
            try {
                const result = JSON.parse(msg.content.toString());
                entryController.processResult(result.data, result);
                channel0.ack(msg);
            } catch (err) {
                LOGGER.error(err);
                channel0.ack(msg);
            }
        }, { noAck: false });
    } else {
        LOGGER.log({ type: "WARN", data: "no message queue config found" });
    }
    // can start process entry
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
                    jobId: botClient.getJobId(entry.actionId),
                    data: entry,
                };
                if (rabbitmqClient.enabled) {
                    rabbitmqClient.channel.publish(
                        CONFIG.rabbitmq.exchangeNames.bot,
                        CONFIG.rabbitmq.topics.submit,
                        Buffer.from(JSON.stringify(body)),
                        {
                            replyTo: CONFIG.rabbitmq.queueNames.school.automation.response,
                        },
                    );
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    const result = await botClient.send(entry);
                    // eslint-disable-next-line no-await-in-loop
                    await entryController.processResult(result.data, result);
                }
            }
        } catch (err) {
        // có thể lỗi mất mạng
            LOGGER.error(err);
        }
    }, CONFIG.automation.repeatProcessAfter);
    // init server
    const server = express();
    server.set("view engine", "ejs");
    // enable cors
    if (CONFIG.allowCors) {
        LOGGER.log({ type: "INFO", data: `allow cors: ${CONFIG.allowCors}` });
        server.use(cors());
    }
    server.use(express.json());
    server.use(express.static(CONFIG.static, { maxAge: String(7 * 24 * 60 * 60 * 1000) /* 7 day */ }));
    server.use("/libs", express.static("./libs", { maxAge: String(7 * 24 * 60 * 60 * 1000) /* 7 day */ }));
    server.use(
        "/docs",
        (req, res, next) => {
            next();
            const extesions = [".sh", ".cmd", ".ps1", ".md", ".ini", ".gitignore"];
            const regex = new RegExp(`^.*(${extesions.join("|")})$`);
            if (req.path.match(regex)) {
                res.set("Content-Type", "text/plain");
            }
        },
        express.static(CONFIG.docsDir, { maxAge: String(7 * 24 * 60 * 60 * 1000) /* 7 day */, dotfiles: "allow" }),
    );
    server.get("/docs/*", (req, res) => {
        // this block of code is hard to understand
        // just run it for debug :)
        const prefix = "/docs";
        const pathRequest = req.path;
        const realpath = pathRequest.substring(prefix.length);
        const faviconUrl = faviconUtils.createFaviconUrl(realpath);
        const filepaths = fs.readdirSync(path.join(CONFIG.docsDir, realpath));
        const entries = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const filepath of filepaths) {
            const isDir = fs.statSync(path.join(CONFIG.docsDir, realpath, filepath)).isDirectory();
            const entry = {};
            entry.name = isDir ? `${filepath}/` : filepath;
            entry.url = path.join(prefix, realpath, filepath);
            entry.type = isDir ? "d" : "f";
            entries.push(entry);
        }
        res.render("explorer", {
            faviconUrl,
            titleName: pathRequest,
            entries,
        });
    });
    server.get("/api/school/automation/entry", automationEntryRouter.find);
    server.post("/api/school/automation/entry", schoolAutomationRateLimit.submitEntry, automationEntryRouter.insert);
    server.put("/api/school/automation/entry/:entryId", automationEntryRouter.update);
    // school/register-preview
    server.get("/api/school/register-preview/classes", schoolClassesRouter.find);
    server.post("/api/school/register-preview/classes", requireCorrectSecretHeader, schoolClassesRouter.find);
    server.delete("/api/school/register-preview/classes", requireCorrectSecretHeader, schoolClassesRouter.drop);
    LOGGER.log({ type: "INFO", data: `bind: ${CONFIG.bind}:${CONFIG.port}` });
    const { port } = CONFIG;
    if (CONFIG.ssl.enabled) {
    // https
        LOGGER.log({ type: "INFO", data: "mode: https" });
        const key = fs.readFileSync(CONFIG.ssl.key);
        const cert = fs.readFileSync(CONFIG.ssl.cert);
        https.createServer({ key, cert }, server).listen(port, CONFIG.bind);
    } else {
    // http
        LOGGER.log({ type: "INFO", data: "mode: http" });
        http.createServer(server).listen(port, CONFIG.bind);
    }
}

main();
