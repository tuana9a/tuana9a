/* eslint-disable no-undef */
const SafeError = require("../../../main/node/global/exceptions/safe-error");
const entryValidation = require("../../../main/node/school/automation/validations/entry.validation");

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
