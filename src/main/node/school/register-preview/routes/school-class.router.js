const stringDTO = require("../../../global/dto/string.dto");
const serverUtils = require("../../../global/utils/server.utils");
const validation = require("../../../global/validations/validation");
const schoolClassController = require("../controllers/school-class.controller");
const semesterValidation = require("../validations/semester.validation");
const SafeError = require("../../../global/exceptions/safe-error");

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
    throw new SafeError("not implemented");
}

async function drop(req) {
    const semester = stringDTO.format(req.query.semester);
    semesterValidation.check(semester);
    const result = await schoolClassController.deleteMany(semester);
    return result;
}

module.exports = {
    find: serverUtils.makeSafeHandler(find),
    insert: serverUtils.makeSafeHandler(insert),
    drop: serverUtils.makeSafeHandler(drop),
};
