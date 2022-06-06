const Config = require("../../../main/node/global/configs/config");

const config = new Config();

describe("test default config fallback value", () => {
    test("should match default value", () => {
        config.loadFromEnv(process.env);
        expect(config).toStrictEqual(new Config({
            bind: "0.0.0.0",
            port: 8080,
            static: "static.local",
            tmp: {
                dir: "./tmp/",
            },
            log: {
                dest: "cs",
                dir: "./logs/",
            },
            ssl: {
                enabled: 0,
                cert: "",
                key: "",
            },
            security: {
                cors: 0,
                secret: "",
            },
            mongodb: {
                connectionString: undefined,
                databaseName: "tuana9a",
                readLimit: 20,
            },
            ignoreRateLimit: 0,
            automation: {
                allowedActions: new Set([
                    "getStudentProgram",
                    "getStudentTimetable",
                    "autoRegisterClasses",
                ]),
                autoRegisterClassesId: "autoRegisterClasses",
                getStudentProgramId: "getStudentProgram",
                getStudentTimetableId: "getStudentTimetable",
                // TODO: remove below endpoint
                hustCaptchaToTextEndpoint: undefined,
                getCaptchaToTextEndpointsUrl: undefined,
                jobMappers: new Map()
                    .set("getStudentTimetable", "./school/hust/automation/jobs/getStudentTimetable")
                    .set("getStudentProgram", "./school/hust/automation/jobs/getStudentProgram")
                    .set("autoRegisterClasses", "./school/hust/automation/jobs/autoRegisterClasses"),
                maxTryCaptchaCount: 10,
                maxTryCount: 10,
                repeatProcessAfter: 30000,
            },
            puppeteer: {
                launchOption: {
                    slowMo: 10,
                    defaultViewport: {
                        width: 1920,
                        height: 1080,
                    },
                },
            },
        }));
    });
});
