const TransformObject = require("../../../global/data/transform-object");
const numberDTO = require("../../../global/dto/number.dto");
const stringDTO = require("../../../global/dto/string.dto");
const DropProp = require("../../../global/transforms/drop-prop");
// eslint-disable-next-line no-unused-vars
const SchoolClass = require("../data/school-class");
const transforms = require("../transforms/school-class.transforms");

module.exports = {
    /**
     * @param {*} object
     * @returns {SchoolClass}
     */
    toSchoolClassToInsert(object) {
        const output = new TransformObject(object)
            .pipe(transforms.pickProp.classToInsert)
            .pipe(transforms.normalize.MaLop)
            .pipe(transforms.normalize.MaLopKem)
            .pipe(transforms.normalize.TenHocPhan)
            .pipe(transforms.normalize.LoaiLop)
            .pipe(transforms.normalize.BuoiHocSo)
            .pipe(transforms.normalize.HocVaoThu)
            .pipe(transforms.normalize.ThoiGianHoc)
            .pipe(transforms.normalize.PhongHoc)
            .pipe(transforms.normalize.HocVaoCacTuan)
            .pipe(transforms.normalize.GhiChu)
            .pipe(transforms.normalize.semester)
            .collect();
        return output;
    },
    extractClassIds(input) {
        const output = [];
        stringDTO
            .format(input)
            .split(",")
            .forEach((x) => {
                output.push(numberDTO.toInt(stringDTO.format(x)));
            });
        return output;
    },
    /**
     * @param {*} object
     * @returns {SchoolClass}
     */
    toClient(object) {
        const output = new TransformObject(object)
            .pipe(DropProp(new Set(["_id"])))
            .collect();
        return output;
    },
};
