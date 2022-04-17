import commonUtils from "../../../../global/utils/common.utils";

export default {
    reduceClasses(classes = [], option = { BuoiHocSo: false }) {
        const classesMap = new Map();
        classes.forEach((schoolClass) => {
            const key = option.BuoiHocSo ? schoolClass.MaLop : `${schoolClass.MaLop}.${schoolClass.BuoiHocSo}`;
            const existClass = classesMap.get(key);
            if (existClass) {
                if (schoolClass.created > existClass.created) {
                    classesMap.set(key, schoolClass);
                }
            } else {
                classesMap.set(key, schoolClass);
            }
        });
        const output = Array.from(classesMap.values());
        return output;
    },
    extractClassIds(value = "") {
        const output = value
            .split(/\s*,\s*|\s+/)
            .map((e) => e.replace(/[\D]+/g, ""))
            .filter((e) => e !== "")
            .map((e) => commonUtils.fromAnyToNumber(e));
        return output;
    },
};
