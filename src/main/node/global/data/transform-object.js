const DateTime = require("./datetime");

class TransformObject {
    /**
     * @param {*} object
     */
    constructor(object, commonDTOs = { numberDTO: null, stringDTO: null }) {
        this.object = object;
        this.numberDTO = commonDTOs.numberDTO;
        this.stringDTO = commonDTOs.stringDTO;
    }

    /**
     * @param {Function} transfom
     */
    transform(transform) {
        this.object = transform(this.object);
        return this;
    }

    dropProps(propNames = []) {
        const { object } = this;
        const output = {};

        for (const propName in object) {
            if (!propNames.includes(propName)) {
                // keep props not in propNames
                output[propName] = object[propName];
            }
        }

        this.object = output;
        return this;
    }

    pickProps(propNames = [], options = { dropFalsy: false }) {
        const { object } = this;
        const output = {};

        for (const propName of propNames) {
            if (options.dropFalsy) {
                if (object[propName]) { // check not falsy value
                    output[propName] = object[propName];
                }
            } else {
                output[propName] = object[propName];
            }
        }
        this.object = output;

        return this;
    }

    normalizeArrayProp(propName, options = { type: "object", default: false }) {
        const { object, numberDTO, stringDTO } = this;
        const check = object[propName];

        if (check === null || check === undefined || !Array.isArray(check)) {
            if (options.default) {
                object[propName] = []; // default for an array;
            }
        } else if (!options || !options.type || options.type === "object" || options.type === "obj") {
            // do nothing
        } else if (options.type === "int") {
            object[propName] = object[propName].map((x) => numberDTO.toInt(x));
        } else if (options.type === "string") {
            object[propName] = object[propName].map((x) => stringDTO.normalize(x));
        }

        return this;
    }

    normalizeIntProp(propName) {
        const { object, numberDTO } = this;
        const check = object[propName];

        if (check === null || check === undefined) {
            return this;
        }

        object[propName] = numberDTO.toInt(object[propName]);
        return this;
    }

    normalizeStringProp(propName) {
        const { object, stringDTO } = this;
        const check = object[propName];

        if (check === null || check === undefined) {
            return this;
        }

        object[propName] = stringDTO.normalize(object[propName]);

        return this;
    }

    replaceIntWithDateTime(propName) {
        const { object, numberDTO } = this;
        const check = object[propName];

        if (check === null || check === undefined) {
            return this;
        }

        object[propName] = new DateTime(new Date(numberDTO.toInt(object[propName])));
        return this;
    }

    collect() {
        return this.object;
    }
}

module.exports = TransformObject;
