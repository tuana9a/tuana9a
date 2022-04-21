/* eslint-disable max-len */
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const http = require("http");
const https = require("https");
const express = require("express");
const mongodb = require("mongodb");

const LOGGER = require("./global/loggers/logger");
const CONFIG = require("./global/configs/config");
const AUTOMATION_CONFIG = require("./school/automation/configs/config");

const schoolClassesRouter = require("./school/register-preview/routes/school-class.router");
const automationEntryRouter = require("./school/automation/routes/entry.router");
const mongodbClient = require("./global/clients/mongodb.client");

const EntryStatus = require("./school/automation/configs/entry-status");
const automationUtils = require("./school/automation/utils/automation.utils");
const botClient = require("./global/clients/bot.client");
const faviconUtils = require("./global/utils/favicon.utils");
const requireCorrectSecretHeader = require("./global/middlewares/require-secret-correct-header");
const schoolAutomationRateLimit = require("./school/automation/middlewares/rate-limit");

botClient.setJobId(AUTOMATION_CONFIG.actionIds.autoRegisterClasses, "dk-sis.hust.edu.vn/autoRegisterClasses");
botClient.setJobId(AUTOMATION_CONFIG.actionIds.getStudentProgram, "ctt-sis.hust.edu.vn/getStudentProgram");
botClient.setJobId(AUTOMATION_CONFIG.actionIds.getStudentTimetable, "ctt-sis.hust.edu.vn/getStudentTimetable");

async function repeatProcessAutomationEntry() {
    // phải sử dụng chung tab vì nếu 2 tab cùng mở ctt-sis sẽ đánh nhau
    // phải cùng loop với execute vì nếu không cũng sẽ đánh nhau
    const entriesCollection = mongodbClient.getEntriesCollection();
    const historyCollection = mongodbClient.getHistoryCollection();
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
            const { historyId } = entry;
            // eslint-disable-next-line no-await-in-loop
            const result = await botClient.send(entry);
            const historyRecord = automationUtils.injectTimestampAt(result);
            historyCollection.updateOne(
                { _id: new mongodb.ObjectId(historyId) },
                {
                    $push: {
                        details: historyRecord,
                    },
                },
            );
            entriesCollection.updateOne(
                // eslint-disable-next-line no-underscore-dangle
                { _id: new mongodb.ObjectId(entry._id) },
                { $set: { status: EntryStatus.DONE } },
            );
        }
    } catch (err) {
        // có thể lỗi mất mạng
        LOGGER.error(err);
    }
    setTimeout(repeatProcessAutomationEntry, CONFIG.automation.repeatProcessAfter);
}

async function main() {
    // init logger
    LOGGER.use(CONFIG.log.dest);
    // init database
    if (CONFIG.database.connectionString) {
        LOGGER.log({ type: "INFO", data: "connecting to database" });
        await mongodbClient.prepare(CONFIG.database.connectionString);
        // eslint-disable-next-line max-len
        mongodbClient.getClassesCollection().createIndex({ MaLop: 1 }); // init collection index for search faster
    } else {
        LOGGER.log({ type: "WARN", data: "no database config found" });
    }
    // can start process entry
    repeatProcessAutomationEntry();
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
    // school/automation
    server.get("/api/school/automation/entry", automationEntryRouter.find);
    server.post("/api/school/automation/entry", schoolAutomationRateLimit.submitEntry, automationEntryRouter.insert);
    server.put("/api/school/automation/entry/:entryId", automationEntryRouter.update);
    // school/register-preview
    server.get("/api/school/register-preview/classes", schoolClassesRouter.find);
    server.post("/api/school/register-preview/classes", requireCorrectSecretHeader, schoolClassesRouter.insert);
    server.delete("/api/school/register-preview/classes", requireCorrectSecretHeader, schoolClassesRouter.drop);
    // create server
    if (CONFIG.ssl.enabled) {
        // https
        LOGGER.log({ type: "INFO", data: `bind: https://${CONFIG.bind}:${CONFIG.port}` });
        https.createServer({
            key: fs.readFileSync(CONFIG.ssl.key),
            cert: fs.readFileSync(CONFIG.ssl.cert),
        }, server).listen(CONFIG.port, CONFIG.bind);
    } else {
        // http
        LOGGER.log({ type: "INFO", data: `bind: http://${CONFIG.bind}:${CONFIG.port}` });
        http.createServer(server).listen(CONFIG.port, CONFIG.bind);
    }
}

main();
