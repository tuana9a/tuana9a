/* eslint-disable no-param-reassign */

const stringDTO = require("../dto/string.dto");
const numberDTO = require("../dto/number.dto");
const BaseTransform = require("./base.transform");

function NormalizeArrayProp(propName, options = { type: "object" }) {
    return new BaseTransform((object) => {
        const check = object[propName];

        if (check === null || check === undefined || !Array.isArray(check)) {
            object[propName] = []; // default for an array;
            return object;
        }

        if (!options || !options.type || options.type === "object" || options.type === "obj") {
            return object;
        }

        if (options.type === "int") {
            object[propName] = object[propName].map((x) => numberDTO.toInt(x));
            return object;
        }

        if (options.type === "string") {
            object[propName] = object[propName].map((x) => stringDTO.normalize(x));
            return object;
        }

        return object;
    });
}

module.exports = NormalizeArrayProp;
