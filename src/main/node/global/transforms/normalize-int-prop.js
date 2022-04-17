const numberDTO = require("../dto/number.dto");
const BaseTransform = require("./base.transform");

function NormalizeIntProp(propName) {
    return new BaseTransform((object) => {
        const check = object[propName];
        if (check === null || check === undefined) {
            return object;
        }
        // eslint-disable-next-line no-param-reassign
        object[propName] = numberDTO.toInt(object[propName]);
        return object;
    });
}

module.exports = NormalizeIntProp;
