const SafeError = require("../../../../main/node/global/exceptions/safe-error");
const IOCContainer = require("../../../../main/node/global/libs/ioc-container");
const SemesterValidation = require("../../../../main/node/school/hust/register-preview/validations/semester.validation");

describe("SemesterValidation", () => {
    const ioc = new IOCContainer();
    ioc.addClassInfo("semesterValidation", SemesterValidation);
    ioc.startup();

    const semesterValidation = ioc.beanPool.get("semesterValidation").instance;

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
});
