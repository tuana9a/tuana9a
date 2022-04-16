module.exports = {
    toString(input) {
        const value = String(input);
        return value;
    },
    format(input) {
        const value = String(input)
            .trim()
            .replace(/\s{2,}/g, " ");
        return value;
    },
};
