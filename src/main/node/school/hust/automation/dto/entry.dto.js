const TransformObject = require("../../../../global/data/transform-object");
const DropProp = require("../../../../global/transforms/drop-prop");
// eslint-disable-next-line no-unused-vars
const Entry = require("../data/entry");
const transforms = require("../transforms/entry.transforms");

module.exports = {
    /**
     * @param {*} object
     * @returns {Entry}
     */
    toEntryToInsert(object) {
        const entry = new TransformObject(object)
            .pipe(transforms.pickProp.entryToInsert)
            .pipe(transforms.normalize.username)
            .pipe(transforms.normalize.password)
            .pipe(transforms.normalize.actionId)
            .pipe(transforms.normalize.classIds)
            .pipe(transforms.normalize.timeToStart)
            .pipe(transforms.replace.timeToStart)
            .collect();
        return entry;
    },
    /**
     * @param {*} object
     * @returns {Entry}
     */
    toEntryToUpdate(object) {
        const entry = new TransformObject(object)
            .pipe(transforms.pickProp.entryToUpdate)
            .pipe(transforms.normalize.username)
            .pipe(transforms.normalize.newUsername)
            .pipe(transforms.normalize.password)
            .pipe(transforms.normalize.newPassword)
            .pipe(transforms.normalize.classIds)
            .pipe(transforms.normalize.actionId)
            .pipe(transforms.normalize.timeToStart)
            .pipe(transforms.normalize.status)
            .pipe(transforms.replace.timeToStart)
            .collect();
        return entry;
    },
    /**
     * mapper cho chuẩn với frontend
     * @param {Entry} entry
     */
    toClient(entry) {
        const output = new TransformObject(entry)
            .pipe(DropProp(new Set(["password"])))
            .collect();
        return output;
    },
};
