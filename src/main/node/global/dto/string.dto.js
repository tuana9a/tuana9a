module.exports = {
    toString(input) {
        const output = String(input);
        return output;
    },
    format(input) {
        const output = this.toString(input).trim();
        return output;
    },
    normalize(input) {
        const output = this.format(input).replace(/\s{2,}/g, " ");
        return output;
    },
};
