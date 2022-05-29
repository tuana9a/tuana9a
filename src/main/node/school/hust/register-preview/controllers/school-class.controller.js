const SafeError = require("../../../../global/exceptions/safe-error");

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

class SchoolClassController {
    CONFIG;

    logger;

    schoolClassDTO;

    mongodbClient;

    /**
     * @param {String} semester
     * @param {String} method
     * @param {*} query
     */
    async findMany(semester, method, query) {
        const classIds = this.schoolClassDTO.extractClassIds(query.classIds);
        const filter = createSearchFilter(method, { classIds });
        const { schoolClassDTO } = this;

        if (!filter) throw new SafeError("wrong method");

        filter.semester = semester;
        const classes = await this.mongodbClient.getClassesCollection()
            .find(filter)
            .limit(this.CONFIG.mongodb.readLimit)
            .toArray();
        const toClient = schoolClassDTO.toClient.bind(schoolClassDTO);
        const result = classes.map(toClient);
        return result;
    }

    async insertMany(classes) {
        const insertResult = await this.mongodbClient.getClassesCollection().insertMany(classes);
        if (insertResult.insertedCount === 0) throw new SafeError("no classes inserted");
        return insertResult.insertedCount;
    }

    /**
     * @param {String} semester
     * @param {*} filter
     */
    async deleteMany(semester, filter = {}) {
        // eslint-disable-next-line no-param-reassign
        filter.semester = semester;
        const result = await this.mongodbClient.getClassesCollection().deleteMany(filter);
        const logRecord = { semester, deletedCount: result.deletedCount };
        this.logger.info(logRecord);
        return logRecord;
    }
}

module.exports = SchoolClassController;
