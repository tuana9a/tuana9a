function int(range) {
    return Math.floor(Math.random() * range);
}

module.exports = {
    uuid() {
        const range = 1000000;
        return int(range).toString() + int(range).toString() + int(range).toString();
    },
};
