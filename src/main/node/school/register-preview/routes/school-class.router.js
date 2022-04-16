const express = require("express");
const multer = require("multer");

const stringDTO = require("../../../global/dto/string.dto");
const serverUtils = require("../../../global/utils/server.utils");
const validation = require("../../../global/validations/validation");
const schoolClassController = require("../controllers/school-class.controller");
const semesterValidation = require("../validations/semester.validation");
const filter = require("../../../global/middlewares/filter");

async function find(req) {
    const { query } = req;
    const semester = stringDTO.format(query.semester);
    const method = stringDTO.format(query.method);
    semesterValidation.check(semester);
    const result = await schoolClassController.findMany(semester, method, query);
    return result;
}

async function insert(req) {
    const semester = stringDTO.format(req.query.semester);
    const { file } = req;
    semesterValidation.check(semester);
    validation.checkNulOrUndefined(file);
    throw new Error("not implemented");
}

async function drop(req) {
    const semester = stringDTO.format(req.query.semester);
    semesterValidation.check(semester);
    const result = await schoolClassController.deleteMany(semester);
    return result;
}

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }).single("file");

const router = express.Router();
router.get("/", serverUtils.wrapper(find));
router.post("/", filter.requireCorrectSecretHeader, upload, serverUtils.wrapper(insert));
router.delete("/", filter.requireCorrectSecretHeader, serverUtils.wrapper(drop));

module.exports = router;
