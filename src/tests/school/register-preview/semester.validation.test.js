/* eslint-disable no-undef */
const SafeError = require("../../../main/node/global/exceptions/safe-error");
const semesterValidation = require("../../../main/node/school/hust/register-preview/validations/semester.validation");

test("semester is null", () => {
    expect(() => {
        semesterValidation.check(null);
    }).toThrow(SafeError);
});

test("semester is undefined", () => {
    expect(() => {
        semesterValidation.check(undefined);
    }).toThrow(SafeError);
});

test("semester is empty", () => {
    expect(() => {
        semesterValidation.check("");
    }).toThrow(SafeError);
});

test("semester is not started with number", () => {
    expect(() => {
        semesterValidation.check("notanumber1234a");
    }).toThrow(SafeError);
});

test("semester is null", () => {
    expect(() => {
        semesterValidation.check("20192");
    }).not.toThrow(SafeError);
});
