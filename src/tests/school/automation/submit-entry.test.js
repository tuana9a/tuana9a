/* eslint-disable no-undef */
const axios = require("axios").default.create();
const dotenv = require("dotenv");

const EntryStatus = require("../../../main/node/school/hust/automation/configs/entry-status");

dotenv.config({ path: ".jest.local.env" });

test("test all submit entry", async () => {
    let entryId = null;
    let body = null;
    let res = null;
    let response = null;

    // insert one
    body = {
        actionId: "getStudentTimetable",
        username: process.env.USERNAMEE,
        password: process.env.WRONG_PASSWORD,
        timeToStart: Date.now(),
    };

    res = await axios.post(`${process.env.SERVER}/api/school/hust/automation/entry`, body);
    response = res.data;

    expect(response.code).toBe(1);
    expect(response.message).toBe("success");
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBeUndefined();
    expect(response.data.entryId).not.toBeNull();
    expect(response.data.historyId).not.toBeNull();

    entryId = response.data.entryId;

    // update one
    body = {
        actionId: "getStudentTimetable",
        username: process.env.USERNAMEE,
        password: process.env.WRONG_PASSWORD,
        newPassword: process.env.PASSWORD,
        timeToStart: Date.now(),
    };

    res = await axios.put(`${process.env.SERVER}/api/school/hust/automation/entry/${entryId}`, body);
    response = res.data;
    expect(response.code).toBe(1);
    expect(response.message).toBe("success");
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBeUndefined();
    expect(response.data).toBe("success");

    // cancel one
    body = {
        actionId: "getStudentTimetable",
        username: process.env.USERNAMEE,
        password: process.env.PASSWORD,
        status: EntryStatus.CANCELED,
    };

    res = await axios.put(`${process.env.SERVER}/api/school/hust/automation/entry/${entryId}`, body);
    response = res.data;
    expect(response.code).toBe(1);
    expect(response.message).toBe("success");
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBeUndefined();
    expect(response.data).toBe("success");

    // failed to update canceled one
    try {
        body = {
            actionId: "getStudentTimetable",
            username: process.env.USERNAMEE,
            password: process.env.PASSWORD,
            status: EntryStatus.CANCELED,
        };
        await axios.put(`${process.env.SERVER}/api/school/hust/automation/entry/${entryId}`, body);
    } catch (err) {
        expect(err.message).toMatch("400");
    }
});
