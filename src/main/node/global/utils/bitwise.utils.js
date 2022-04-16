/* eslint-disable no-bitwise */
module.exports = {
    checkBitOn(input, nth) {
        return (input & (1 << nth)) !== 0;
    },
    setBitOn(input, nth) {
        return input | (1 << nth);
    },
    setBitOff(input, nth) {
        return input & (~0 & ~(1 << nth));
    },
};
