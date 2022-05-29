/* eslint-disable no-undef */

const NumberDTO = require("../../../../main/node/global/dto/number.dto");
const StringDTO = require("../../../../main/node/global/dto/string.dto");
const IOCContainer = require("../../../../main/node/global/libs/ioc-container");
const SchoolClassDTO = require("../../../../main/node/school/hust/register-preview/dto/school-class.dto");

describe("SchoolClassDTO", () => {
    const ioc = new IOCContainer();
    ioc.addClassInfo("numberDTO", NumberDTO);
    ioc.addClassInfo("stringDTO", StringDTO);
    ioc.addClassInfo("schoolClassDTO", SchoolClassDTO);
    ioc.startup();

    const schoolClassDTO = ioc.beanPool.get("schoolClassDTO").instance;

    test("need extract class ids like I wanted", () => {
        expect(schoolClassDTO.extractClassIds("1,2,3,4")).toEqual([1, 2, 3, 4]);
        expect(schoolClassDTO.extractClassIds(" 1, 2 ,  3 ,  4  ")).toEqual([1, 2, 3, 4]);
        expect(schoolClassDTO.extractClassIds("1,,3,4")).toEqual([1, 0, 3, 4]);
    });
});
