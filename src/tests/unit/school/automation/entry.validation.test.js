/* eslint-disable no-undef */

const SafeError = require("../../../../main/node/global/exceptions/safe-error");
const IOCContainer = require("../../../../main/node/global/libs/ioc-container");
const ArrayValidation = require("../../../../main/node/global/validations/array.validation");
const AutomationConfig = require("../../../../main/node/school/hust/automation/configs/config");
const EntryValidation = require("../../../../main/node/school/hust/automation/validations/entry.validation");

describe("EntryValidation", () => {
    const ioc = new IOCContainer();
    ioc.addClassInfo("arrayValidation", ArrayValidation);
    ioc.addClassInfo("AUTOMATION_CONFIG", AutomationConfig);
    ioc.addClassInfo("entryValidation", EntryValidation);
    ioc.startup();

    const AUTOMATION_CONFIG = ioc.beanPool.get("AUTOMATION_CONFIG").instance;
    AUTOMATION_CONFIG.loadFromEnv(process.env);
    const entryValidation = ioc.beanPool.get("entryValidation").instance;

    test("should throw error if entry.username is null", () => {
        expect(() => {
            entryValidation.checkUsername(null);
        }).toThrow(SafeError);
    });

    test("should throw error if entry.username is undefined", () => {
        expect(() => {
            entryValidation.checkUsername(undefined);
        }).toThrow(SafeError);
    });

    test("should throw error if entry.username is empty", () => {
        expect(() => {
            entryValidation.checkUsername(10 * " ");
        }).toThrow(SafeError);
    });

    test("shoud throw error if entry.username is good", () => {
        expect(entryValidation.checkUsername("20183656")).toBe(undefined);
    });

    test("shoud throw error entry.actionId is not exists", () => {
        expect(() => {
            entryValidation.checkActionId("something is not exists");
        }).toThrow(SafeError);
    });

    test("shoud throw error entry.classIds is undefined", () => {
        expect(() => {
            entryValidation.checkClassIds(undefined);
        }).toThrow(SafeError);
    });

    test("shoud throw error entry.classIds is empty", () => {
        expect(() => {
            entryValidation.checkClassIds([]);
        }).toThrow(SafeError);
    });

    test("shoud throw error entry.classIds is not type string", () => {
        expect(() => {
            entryValidation.checkClassIds([1234, 41234]);
        }).toThrow(SafeError);
    });

    test("shoud throw error entry.classIds is not type string", () => {
        expect(() => {
            entryValidation.checkClassIds(["1234", 41234]);
        }).toThrow(SafeError);
    });
});
