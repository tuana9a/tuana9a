const mongodbClient = require("../../../global/clients/mongodb.client");
const CONFIG = require("../../../global/configs/config");
const schoolClassDTO = require("../dto/school-class.dto");
const LOGGER = require("../../../global/loggers/logger");
const SafeError = require("../../../global/exceptions/safe-error");

/**
 * @param {String} method
 */
function createSearchFilter(method, data = { classIds: [] }) {
    if (method === "range") {
        const { classIds } = data;
        return {
            $or: classIds.map((id) => {
                const missing = 6 - String(id).length;
                let filter = {};
                if (missing === 0) {
                    filter = { MaLop: id };
                } else {
                    const delta = 10 ** missing;
                    filter = { MaLop: { $gte: id * delta, $lte: id * delta + delta } };
                }
                return filter;
            }),
        };
    }
    if (method === "match") {
        const { classIds } = data;
        return { MaLop: { $in: classIds } };
    }
    return null;
}

module.exports = {
    /**
     * @param {String} semester
     * @param {String} method
     * @param {*} query
     */
    async findMany(semester, method, query) {
        const classIds = schoolClassDTO.extractClassIds(query.classIds);
        const filter = createSearchFilter(method, { classIds });
        if (!filter) throw new SafeError("wrong method");
        filter.semester = semester;
        const classes = await mongodbClient.getClassesCollection().find(filter)
            .limit(CONFIG.database.readLimit)
            .toArray();
        const result = classes.map((x) => schoolClassDTO.toClient(x));
        return result;
    },
    async insertMany(classes) {
        const insertResult = await mongodbClient.getClassesCollection().insertMany(classes);
        if (insertResult.insertedCount === 0) throw new SafeError("no classes inserted");
        return insertResult.insertedCount;
    },
    /**
     * @param {String} semester
     * @param {*} filter
     */
    async deleteMany(semester, filter = {}) {
        // eslint-disable-next-line no-param-reassign
        filter.semester = semester;
        const result = await mongodbClient.getClassesCollection().deleteMany(filter);
        const logRecord = { semester, deletedCount: result.deletedCount };
        LOGGER.info(logRecord);
        return logRecord;
    },
};
