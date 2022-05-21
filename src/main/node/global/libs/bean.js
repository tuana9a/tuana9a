/* eslint-disable object-curly-newline */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

class Bean {
    constructor({ name, instance, propagates, dependOns, missingDepsCount }) {
        this.name = name;
        this.instance = instance;
        this.propagates = propagates;
        this.dependOns = dependOns;
        this.missingDepsCount = missingDepsCount;
    }

    doPropagate(beanPool) {
        const missingZeroDepsBeans = [];
        for (const nextName of this.propagates) {
            const nextBean = beanPool.get(nextName);
            if (!nextBean) {
                beanPool.get("logger").warn(`bean: "${nextName}" is not exist`);
                continue;
            }
            nextBean.missingDepsCount -= 1;
            nextBean.instance[this.name] = this.instance;
            if (nextBean.missingDepsCount === 0) {
                missingZeroDepsBeans.push(nextBean);
                // TODO: nếu propagate như này có khi không cần propagate queue nữa
                // stack vs queues: let see
                const nextMissingZeroDepsBeans = nextBean.doPropagate(beanPool);
                missingZeroDepsBeans.push(...nextMissingZeroDepsBeans);
            }
        }
        return missingZeroDepsBeans;
    }
}

module.exports = Bean;
