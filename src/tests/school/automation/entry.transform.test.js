/* eslint-disable no-undef */
const DateTime = require("../../../main/node/global/data/datetime");
const entryDTO = require("../../../main/node/school/hust/automation/dto/entry.dto");

test("entry to insert", () => {
    const now = new Date();
    const received = entryDTO.toEntryToInsert({
        propWillBeDrop: "hello",
        username: "u ",
        password: " p  ",
        timeToStart: now.getTime(),
        actionId: "getStudentTimetable  ",
        status: "this status will be drop",
        created: "this created will be drop too",
    });
    const expected = {
        username: "u",
        password: "p",
        timeToStart: new DateTime(now),
        actionId: "getStudentTimetable",
    };
    expect(received).toEqual(expected);
});

test("entry to update", () => {
    const now = new Date();
    const received = entryDTO.toEntryToUpdate({
        propWillBeDrop: "hello",
        username: "u ",
        newUsername: "newUsername ",
        password: " p  ",
        newPassword: "  newPassword ",
        timeToStart: now.getTime(),
        actionId: "getStudentTimetable   ",
        status: "PENDING ",
        created: "this created will be drop too",
    });
    const expected = {
        username: "u",
        newUsername: "newUsername",
        password: "p",
        newPassword: "newPassword",
        timeToStart: new DateTime(now),
        actionId: "getStudentTimetable",
        status: "PENDING",
    };
    expect(received).toEqual(expected);
});
