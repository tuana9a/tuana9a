const stringDTO = require("../../../../global/dto/string.dto");
const serverUtils = require("../../../../global/utils/server.utils");
const validation = require("../../../../global/validations/validation");
const schoolClassController = require("../controllers/school-class.controller");
const semesterValidation = require("../validations/semester.validation");
const schoolClassDTO = require("../dto/school-class.dto");
const arrayValidation = require("../../../../global/validations/array.validation");

async function find(req) {
    const { query } = req;
    const semester = stringDTO.format(query.semester);
    const method = stringDTO.format(query.method);
    semesterValidation.check(semester);
    const result = await schoolClassController.findMany(semester, method, query);
    return result;
}

async function insert(req) {
    validation.checkNulOrUndefined(req.body);
    arrayValidation.isArray(req.body.classes);
    const classes = req.body.classes.map((x) => {
        const output = schoolClassDTO.toSchoolClassToInsert(x);
        output.created = Date.now();
        return output;
    });
    const result = await schoolClassController.insertMany(classes);
    return result;
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
