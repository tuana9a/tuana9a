const BaseTransform = require("./base.transform");

function PickProp(propNames = []) {
    return new BaseTransform((object) => {
        const output = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const propName of propNames) {
            if (object[propName]) {
                // WARN: this will skip any falsy value
                output[propName] = object[propName];
            }
        }
        return output;
    });
}

module.exports = PickProp;
