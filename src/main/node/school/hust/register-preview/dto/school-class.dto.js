const TransformObject = require("../../../../global/data/transform-object");
// eslint-disable-next-line no-unused-vars
const SchoolClass = require("../data/school-class");

class SchoolClassDTO {
    numberDTO;

    stringDTO;

    /**
     * @param {*} object
     * @returns {SchoolClass}
     */
    toSchoolClassToInsert(object) {
        const { numberDTO, stringDTO } = this;
        const output = new TransformObject(object, { numberDTO, stringDTO })
            .pickProps([
                "MaLop",
                "MaLopKem",
                "MaHocPhan",
                "TenHocPhan",
                "LoaiLop",
                "BuoiHocSo",
                "HocVaoThu",
                "ThoiGianHoc",
                "PhongHoc",
                "HocVaoCacTuan",
                "GhiChu",
                "semester",
                "created",
            ])
            .normalizeIntProp("MaLop")
            .normalizeIntProp("MaLopKem")
            .normalizeStringProp("MaHocPhan")
            .normalizeStringProp("TenHocPhan")
            .normalizeStringProp("LoaiLop")
            .normalizeIntProp("BuoiHocSo")
            .normalizeIntProp("HocVaoThu")
            .normalizeStringProp("ThoiGianHoc")
            .normalizeStringProp("PhongHoc")
            .normalizeStringProp("HocVaoCacTuan")
            .normalizeStringProp("GhiChu")
            .normalizeStringProp("semester")
            .collect();
        return output;
    }

    extractClassIds(input) {
        const { numberDTO, stringDTO } = this;
        const output = stringDTO
            .format(input)
            .split(",")
            .map((x) => numberDTO.toInt(stringDTO.format(x)));
        return output;
    }

    /**
     * @param {*} object
     * @returns {SchoolClass}
     */
    toClient(object) {
        const { numberDTO, stringDTO } = this;
        const output = new TransformObject(object, { numberDTO, stringDTO })
            .dropProps(["_id"])
            .collect();
        return output;
    }
}

module.exports = SchoolClassDTO;
