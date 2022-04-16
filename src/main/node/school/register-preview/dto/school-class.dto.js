const numberDTO = require("../../../global/dto/number.dto");
const stringDTO = require("../../../global/dto/string.dto");
const SchoolClass = require("../data/school-class");

module.exports = {
    format(x) {
        const output = new SchoolClass();
        output.MaLop = numberDTO.toInt(x.MaLop);
        output.BuoiHocSo = numberDTO.toInt(x.BuoiHocSo);
        output.HocVaoThu = stringDTO.format(x.HocVaoThu);
        output.PhongHoc = stringDTO.format(x.PhongHoc);
        output.ThoiGianHoc = stringDTO.format(x.ThoiGianHoc);
        output.HocVaoCacTuan = stringDTO.format(x.HocVaoCacTuan);
        output.MaLopKem = numberDTO.toInt(x.MaLopKem);
        output.LoaiLop = stringDTO.format(x.LoaiLop);
        output.MaHocPhan = stringDTO.format(x.MaHocPhan);
        output.TenHocPhan = stringDTO.format(x.TenHocPhan);
        output.GhiChu = stringDTO.format(x.GhiChu);
        output.semester = x.semester;
        output.created = numberDTO.toInt(x.created);
        return output;
    },
    extractClassIds(stringValue) {
        return stringDTO
            .format(stringValue)
            .split(",")
            .map((x) => numberDTO.toInt(x));
    },
};
