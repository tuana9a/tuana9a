/* eslint-disable object-curly-newline */
/* eslint-disable no-continue */

class Bean {
    constructor({ name, instance, injectTos, dependOns, missingDepsCount }) {
        this.name = name;
        this.instance = instance;
        this.injectTos = injectTos;
        this.dependOns = dependOns;
        this.missingDepsCount = missingDepsCount;
    }
}

module.exports = Bean;
