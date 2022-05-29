const SafeError = require("../exceptions/safe-error");

class ArrayValidation {
    isArray(object, opts = { name: "" }) {
        if (!Array.isArray(object)) {
            throw new SafeError(`${opts.name} is not an array`);
        }
    }

    checkSize(array, size, opts = { name: "" }) {
        this.isArray(array, { name: opts.name });
        if (array.length > size) {
            throw new SafeError(`${opts.name} array size exceed`);
        }
    }
}

module.exports = ArrayValidation;
