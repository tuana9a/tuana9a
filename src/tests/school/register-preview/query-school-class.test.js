/* eslint-disable no-undef */
const dotenv = require("dotenv");
const axios = require("axios").default.create();
const schoolClassDTO = require("../../../main/node/school/register-preview/dto/school-class.dto");

dotenv.config({ path: ".jest.local.env" });

test("need query range success", async () => {
    const query = "classIds=12&method=range&semester=20211";
    const res = await axios.get(`${process.env.SERVER}/api/school/register-preview/classes?${query}`);
    const response = res.data;
    expect(response.code).toBe(1);
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBeUndefined();
});

test("need query match success", async () => {
    const query = "classIds=129886,129887,129888&method=match&semester=20211";
    const res = await axios.get(`${process.env.SERVER}/api/school/register-preview/classes?${query}`);
    const response = res.data;
    expect(response.code).toBe(1);
    expect(response.data).not.toBeNull();
    expect(response.data).not.toBeUndefined();
});

test("need extract class ids like I wanted", () => {
    expect(schoolClassDTO.extractClassIds("1,2,3,4")).toEqual([1, 2, 3, 4]);
});
