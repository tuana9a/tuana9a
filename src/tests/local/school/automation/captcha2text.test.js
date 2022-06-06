const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios").default.create();
const { GET_CAPTCHA_TO_TEXT_ENDPOINTS_URL, CAPTCHA_DIR } = require("./config.local");

jest.setTimeout(30_000);

describe("test captcha2text services", () => {
    test("should return array list of endpoints", async () => {
        const response = await axios.get(GET_CAPTCHA_TO_TEXT_ENDPOINTS_URL).then((res) => res.data);
        expect(response).toBeTruthy();
        expect(response.length).toBeGreaterThanOrEqual(1);
    });
    test.each(fs.readdirSync(CAPTCHA_DIR).map((fileName) => {
        const [expectedValue] = fileName.split("_");
        return [fileName, expectedValue];
    }))(
        'shoud "%s" be predicted as "%i"',
        async (fileName, expectedValue) => {
            let response = await axios.get(GET_CAPTCHA_TO_TEXT_ENDPOINTS_URL).then((res) => res.data);
            const PREDICT_URL = response[0];
            const formData = new FormData();
            formData.append("file", fs.createReadStream(`${CAPTCHA_DIR}/${fileName}`));
            response = await axios.post(PREDICT_URL, formData, { headers: formData.getHeaders() }).then((res) => res.data);
            expect(String(response)).toBe(expectedValue);
        },
    );
});
