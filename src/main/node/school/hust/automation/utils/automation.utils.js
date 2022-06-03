const DateTime = require("../../../../global/data/datetime");

module.exports = {
    injectTimestampAt(object) {
        // eslint-disable-next-line no-param-reassign
        object.at = new DateTime();
        return object;
    },
    createEntryDiff(oldEntry, newEntry, opts = { ignoreKey: new Set() }) {
        const diff = {};
        const { ignoreKey } = opts;
        const keys = new Set(Object.keys(oldEntry).concat(Object.keys(newEntry)));
        for (const key of keys) {
            if (ignoreKey.has(key) || !newEntry[key]) {
                // eslint-disable-next-line no-continue
                continue;
            }
            if (oldEntry[key] !== newEntry[key]) {
                diff[key] = {
                    old: oldEntry[key],
                    replace: newEntry[key],
                };
            }
        }
        return diff;
    },
};
