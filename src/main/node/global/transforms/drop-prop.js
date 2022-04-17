const BaseTransform = require("./base.transform");

function DropProp(propNames = new Set()) {
    return new BaseTransform((object) => {
        const output = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const propName in object) {
            if (propNames.has(propName)) {
                // eslint-disable-next-line no-continue
                continue;
            }
            output[propName] = object[propName];
        }
        return output;
    });
}

module.exports = DropProp;
