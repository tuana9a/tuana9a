module.exports = {
    injectTimestampAt(object) {
        const now = new Date();
        // eslint-disable-next-line no-param-reassign
        object.at = {
            n: now.getTime(),
            s: now.toLocaleString(),
        };
        return object;
    },
    createEntryDiff(oldEntry, newEntry, opts = { ignoreKey: new Set() }) {
        const diff = {};
        const { ignoreKey } = opts;
        const keys = new Set(Object.keys(oldEntry).concat(Object.keys(newEntry)));
        // eslint-disable-next-line no-restricted-syntax
        for (const key of keys) {
            if (ignoreKey.has(key) || !newEntry[key]) {
                // eslint-disable-next-line no-continue
                continue;
            }
            if (oldEntry[key] !== newEntry[key]) {
                diff[key] = {
                    old: oldEntry[key],
                    new: newEntry[key],
                    str: `${oldEntry[key]} -> ${newEntry[key]}`,
                };
            }
        }
        return diff;
    },
};
