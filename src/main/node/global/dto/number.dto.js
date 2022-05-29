class NumberDTO {
    toInt(input) {
        const value = parseInt(input) || 0;
        return value;
    }
}
module.exports = NumberDTO;
