const axios = require("axios").default.create();
const { SERVER } = require("./config.local");

describe("test query classes", () => {
    test("need query range success", async () => {
        const query = "classIds=12&method=range&semester=20211";
        let response = await axios.get(`${SERVER}/api/school/hust/register-preview/classes?${query}`);
        response = response.data;
        expect(response.code).toBe(1);
        expect(response.data).not.toBeFalsy();
        expect(response.data.length).toBeGreaterThanOrEqual(1);
    });

    test("need query match success", async () => {
        const query = "classIds=129886,129887,129888&method=match&semester=20211";
        let response = await axios.get(`${SERVER}/api/school/hust/register-preview/classes?${query}`);
        response = response.data;
        expect(response.code).toBe(1);
        expect(response.data).not.toBeFalsy();
        expect(response.data.length).toBeGreaterThanOrEqual(1);
    });
});
