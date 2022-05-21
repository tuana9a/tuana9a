/* eslint-disable no-undef */
const SafeError = require("../../../main/node/global/exceptions/safe-error");
const arrayValidation = require("../../../main/node/global/validations/array.validation");
const AUTOMATION_CONFIG = require("../../../main/node/school/hust/automation/configs/config");
const EntryValidation = require("../../../main/node/school/hust/automation/validations/entry.validation");

const entryValidation = new EntryValidation();
entryValidation.AUTOMATION_CONFIG = AUTOMATION_CONFIG;
entryValidation.arrayValidation = arrayValidation;

test("entry.username is null", () => {
    expect(() => {
        entryValidation.checkUsername(null);
    }).toThrow(SafeError);
});

test("entry.username is undefined", () => {
    expect(() => {
        entryValidation.checkUsername(undefined);
    }).toThrow(SafeError);
});

test("entry.username is empty", () => {
    expect(() => {
        entryValidation.checkUsername(10 * " ");
    }).toThrow(SafeError);
});

test("entry.username is good", () => {
    expect(entryValidation.checkUsername("20183656")).toBe(undefined);
});

test("entry.actionId is not existe", () => {
    expect(() => {
        entryValidation.checkActionId("somethingis not exsits");
    }).toThrow(SafeError);
});

test("entry.classIds is undefined", () => {
    expect(() => {
        entryValidation.checkClassIds(undefined);
    }).toThrow(SafeError);
});

test("entry.classIds is empty", () => {
    expect(() => {
        entryValidation.checkClassIds([]);
    }).toThrow(SafeError);
});

test("entry.classIds is not type string", () => {
    expect(() => {
        entryValidation.checkClassIds([1234, 41234]);
    }).toThrow(SafeError);
});

test("entry.classIds is not type string", () => {
    expect(() => {
        entryValidation.checkClassIds(["1234", 41234]);
    }).toThrow(SafeError);
});
