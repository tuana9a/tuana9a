const stringDTO = require("../dto/string.dto");
const BaseTransform = require("./base.transform");

function NormalizeStringProp(propName) {
    return new BaseTransform((object) => {
        const check = object[propName];
        if (check === null || check === undefined) {
            return object;
        }
        // eslint-disable-next-line no-param-reassign
        object[propName] = stringDTO.normalize(object[propName]);
        return object;
    });
}

module.exports = NormalizeStringProp;
