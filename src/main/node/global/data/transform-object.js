// eslint-disable-next-line no-unused-vars
const BaseTransform = require("../transforms/base.transform");

class TransformObject {
    /**
     * @param {*} object
     */
    constructor(object) {
        this.object = object;
    }

    /**
     * @param {BaseTransform} transfom
     */
    pipe(transfom) {
        this.object = transfom.transform(this.object);
        return this;
    }

    collect() {
        return this.object;
    }
}

module.exports = TransformObject;
