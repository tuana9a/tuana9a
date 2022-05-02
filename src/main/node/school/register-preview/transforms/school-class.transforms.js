const NormalizeIntProp = require("../../../global/transforms/normalize-int-prop");
const NormalizeStringProp = require("../../../global/transforms/normalize-string-prop");
const PickProp = require("../../../global/transforms/pick-prop");

module.exports = {
    normalize: {
        MaLop: NormalizeIntProp("MaLop"),
        MaLopKem: NormalizeIntProp("MaLopKem"),
        TenHocPhan: NormalizeIntProp("TenHocPhan"),
        LoaiLop: NormalizeStringProp("LoaiLop"),
        BuoiHocSo: NormalizeStringProp("BuoiHocSo"),
        HocVaoThu: NormalizeIntProp("HocVaoThu"),
        ThoiGianHoc: NormalizeStringProp("ThoiGianHoc"),
        PhongHoc: NormalizeStringProp("PhongHoc"),
        HocVaoCacTuan: NormalizeStringProp("HocVaoCacTuan"),
        GhiChu: NormalizeStringProp("GhiChu"),
        semester: NormalizeStringProp("semester"),
        created: NormalizeIntProp("created"),
    },
    pickProp: {
        classToInsert: PickProp([
            "MaLop",
            "MaLopKem",
            "TenHocPhan",
            "LoaiLop",
            "BuoiHocSo",
            "HocVaoThu",
            "ThoiGianHoc",
            "PhongHoc",
            "HocVaoCacTuan",
            "GhiChu",
            "semester",
        ]),
    },
};
