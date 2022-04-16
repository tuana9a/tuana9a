/**
 * có thể có nhiều bản ghi trùng MaLop, khác BuoiHocSo
 * index là BuoiHocSo và MaLop
 */
class SchoolClass {
    /**
     * @param {Number} MaLop
     * @param {Number} MaLopKem
     * @param {String} LoaiLop
     * @param {String} MaHocPhan
     * @param {String} TenHocPhan
     * @param {Number} BuoiHocSo
     * @param {String} HocVaoThu
     * @param {String} ThoiGianHoc
     * @param {String} PhongHoc
     * @param {String} HocVaoCacTuan
     * @param {String} GhiChu
     * @param {String} semester
     * @param {Number} created
     */
    constructor(
        MaLop,
        MaLopKem,
        LoaiLop,
        MaHocPhan,
        TenHocPhan,
        BuoiHocSo,
        HocVaoThu,
        ThoiGianHoc,
        PhongHoc,
        HocVaoCacTuan,
        GhiChu,
        semester,
        created,
    ) {
        this.MaLop = MaLop;
        this.MaLopKem = MaLopKem;
        this.LoaiLop = LoaiLop;
        this.MaHocPhan = MaHocPhan;
        this.TenHocPhan = TenHocPhan;
        this.BuoiHocSo = BuoiHocSo;
        this.HocVaoThu = HocVaoThu;
        this.ThoiGianHoc = ThoiGianHoc;
        this.PhongHoc = PhongHoc;
        this.HocVaoCacTuan = HocVaoCacTuan;
        this.GhiChu = GhiChu;
        this.semester = semester;
        this.created = created || Date.now();
    }
}

module.exports = SchoolClass;
