const axios = require("axios").default.create();
const EntryStatus = require("../../../../main/node/school/hust/automation/data/entry-status");
const { SERVER, ENTRIES } = require("./config.local");

const [ENTRY] = ENTRIES;
const { USERNAME, WRONG_PASSWORD, PASSWORD } = ENTRY;

describe("test submit entries", () => {
    test("get entries success", async () => {
        let response = await axios.get(`${SERVER}/api/school/hust/automation/entries`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`,
            },
        });
        response = response.data;

        expect(response.code).toBe(1);
        expect(response.message).toBe("success");
        expect(response.data.length).toBeGreaterThanOrEqual(1);
    });

    test("insert entry success", async () => {
        const body = {
            data: {
                actionId: "getStudentTimetable",
                username: USERNAME,
                password: WRONG_PASSWORD,
                timeToStart: Date.now(),
            },
        };
        let response = await axios.post(`${SERVER}/api/school/hust/automation/entries`, body);
        response = response.data;

        expect(response.code).toBe(1);
        expect(response.message).toBe("success");
        expect(response.data).toStrictEqual({
            entryId: expect.any(String),
        });
    });

    test("insert many entries success", async () => {
        const body = {
            data: [
                {
                    actionId: "getStudentTimetable",
                    username: USERNAME,
                    password: WRONG_PASSWORD,
                    timeToStart: Date.now(),
                },
                {
                    actionId: "getStudentTimetable",
                    username: USERNAME,
                    password: WRONG_PASSWORD,
                    timeToStart: Date.now(),
                },
            ],
        };
        let response = await axios.post(`${SERVER}/api/school/hust/automation/entries`, body);
        response = response.data;

        expect(response.code).toBe(1);
        expect(response.message).toBe("success");
        expect(response.data).toStrictEqual([
            {
                entryId: expect.any(String),
            },
            {
                entryId: expect.any(String),
            },
        ]);
    });

    test("update entry success", async () => {
        // create existed one
        let response = await axios.post(`${SERVER}/api/school/hust/automation/entries`, {
            data: {
                actionId: "getStudentTimetable",
                username: USERNAME,
                password: WRONG_PASSWORD,
                timeToStart: Date.now(),
            },
        });
        response = response.data;
        expect(response.code).toBe(1);
        expect(response.message).toBe("success");
        expect(response.data).toStrictEqual({
            entryId: expect.any(String),
        });

        const { entryId } = response.data;

        const now = new Date();
        const body = {
            data: {
                actionId: "getStudentTimetable",
                username: USERNAME,
                password: WRONG_PASSWORD,
                newPassword: PASSWORD,
                timeToStart: now.getTime(),
            },
        };
        response = await axios.put(`${SERVER}/api/school/hust/automation/entries/${entryId}`, body);
        response = response.data;
        expect(response.code).toBe(1);
        expect(response.message).toBe("success");
        expect(response.data).not.toBeFalsy();
        expect(response.data).toStrictEqual({
            _id: expect.anything(),
            name: "update",
            data: expect.anything(),
            created: expect.anything(),
            isCompleted: false,
            logs: [
                {
                    diff: {
                        password: {
                            old: WRONG_PASSWORD,
                            replace: PASSWORD,
                        },
                        timeToStart: {
                            old: expect.anything(),
                            replace: {
                                n: now.getTime(),
                                s: now.toString(),
                            },
                        },
                    },
                    at: expect.anything(),
                },
            ],
        });
    });

    test("cancel enntry success", async () => {
        // create existed one
        let response = await axios.post(`${SERVER}/api/school/hust/automation/entries`, {
            data: {
                actionId: "getStudentTimetable",
                username: USERNAME,
                password: WRONG_PASSWORD,
                timeToStart: Date.now(),
            },
        });
        response = response.data;
        expect(response.code).toBe(1);
        expect(response.message).toBe("success");
        expect(response.data).toStrictEqual({
            entryId: expect.any(String),
        });

        const { entryId } = response.data;

        const body = {
            data: {
                actionId: "getStudentTimetable",
                username: USERNAME,
                password: WRONG_PASSWORD,
                status: EntryStatus.CANCELED,
            },
        };

        response = await axios.put(`${SERVER}/api/school/hust/automation/entries/${entryId}`, body);
        response = response.data;
        expect(response.code).toBe(1);
        expect(response.message).toBe("success");
        expect(response.data).not.toBeFalsy();
        expect(response.data).toStrictEqual({
            _id: expect.anything(),
            name: "update",
            data: expect.anything(),
            created: expect.anything(),
            isCompleted: false,
            logs: [
                {
                    diff: {
                        status: {
                            old: EntryStatus.READY,
                            replace: EntryStatus.CANCELED,
                        },
                    },
                    at: expect.anything(),
                },
            ],
        });
    });

    test("should failed to cancel a done entry", async () => {
        let response = await axios.get(`${SERVER}/api/school/hust/automation/entries`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64")}`,
            },
        });
        response = response.data;
        const entry = response.data[0];
        expect([EntryStatus.DONE, EntryStatus.CANCELED, EntryStatus.FAILED]).toContain(entry.status);
        // eslint-disable-next-line no-underscore-dangle
        const entryId = entry._id;
        try {
            const body = {
                data: {
                    actionId: "getStudentTimetable",
                    username: USERNAME,
                    password: PASSWORD,
                    status: EntryStatus.CANCELED,
                },
            };
            await axios.put(`${SERVER}/api/school/hust/automation/entries/${entryId}`, body);
        } catch (err) {
            expect(err.message).toMatch("400");
        }
    });
});
