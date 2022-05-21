class SchoolClassRouter {
    schoolClassController;

    validation;

    stringDTO;

    semesterValidation;

    schoolClassDTO;

    arrayValidation;

    serverUtils;

    postInjection() {
        this.find = this.serverUtils.makeSafeHandler(this.find, this);
        this.insert = this.serverUtils.makeSafeHandler(this.insert, this);
        this.drop = this.serverUtils.makeSafeHandler(this.drop, this);
    }

    async find(req) {
        const { query } = req;
        const semester = this.stringDTO.format(query.semester);
        const method = this.stringDTO.format(query.method);
        this.semesterValidation.check(semester);
        const result = await this.schoolClassController.findMany(semester, method, query);
        return result;
    }

    async insert(req) {
        this.validation.checkNulOrUndefined(req.body);
        this.arrayValidation.isArray(req.body.classes);
        const classes = req.body.classes.map((x) => {
            const output = this.schoolClassDTO.toSchoolClassToInsert(x);
            output.created = Date.now();
            return output;
        });
        const result = await this.schoolClassController.insertMany(classes);
        return result;
    }

    async drop(req) {
        const semester = this.stringDTO.format(req.query.semester);
        this.semesterValidation.check(semester);
        const result = await this.schoolClassController.deleteMany(semester);
        return result;
    }
}

module.exports = SchoolClassRouter;
