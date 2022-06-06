/* eslint-disable max-classes-per-file */
const IOCContainer = require("../../../main/node/global/libs/ioc-container");

describe("test ioc", () => {
    test("1. can handle cyling deps", () => {
        class Test1 {
            test2;
        }

        class Test2 {
            test1;
        }

        const ioc = new IOCContainer();
        ioc.addClassInfo("test1", Test1);
        ioc.addClassInfo("test2", Test2);
        ioc.startup();

        const test1 = ioc.beanPool.get("test1").instance;
        const test2 = ioc.beanPool.get("test2").instance;

        expect(test1.test2).toBe(test2);
        expect(test2.test1).toBe(test1);
    });

    test("2. can handle normal case", () => {
        class Test1 {
            test2;
        }

        class Test2 {
            test3;
        }

        class Test3 {

        }

        const ioc = new IOCContainer();
        ioc.addClassInfo("test1", Test1);
        ioc.addClassInfo("test2", Test2);
        ioc.addClassInfo("test3", Test3);
        ioc.startup();

        const test1 = ioc.beanPool.get("test1").instance;
        const test2 = ioc.beanPool.get("test2").instance;
        const test3 = ioc.beanPool.get("test3").instance;

        expect(test1.test2).toBe(test2);
        expect(test2.test3).toBe(test3);
    });
});
