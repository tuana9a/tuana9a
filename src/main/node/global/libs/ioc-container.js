/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

const Bean = require("./bean");

class IOCContainer {
    constructor() {
        this.beanPool = new Map();
        this.classInfoPool = new Map();
        this.propagateQueue = [];
    }

    addClassInfo(name, Classs, dependOns = [], ignoreDeps = [], autowired = true) {
        this.classInfoPool.set(name, { name, Classs, dependOns, ignoreDeps, autowired });
    }

    addZeroDependencyBean(name, instance) {
        if (this.beanPool.has(name)) {
            const existBean = this.beanPool.get(name);
            existBean.instance = instance;
        } else {
            const newBean = new Bean({
                name,
                instance,
                propagates: [],
                dependOns: [],
                missingDepsCount: 0,
            });
            this.beanPool.set(name, newBean);
            this.propagateQueue.push(newBean);
        }
    }

    prepare() {
        // init dependency graph
        for (const name of this.classInfoPool.keys()) {
            // only take classPool to init
            // zero dependency bean no need to loop
            const classInfo = this.classInfoPool.get(name);
            const instance = new classInfo.Classs();
            let instanceDepNames = classInfo.autowired ? Object.keys(instance) : classInfo.dependOns;
            instanceDepNames = (instanceDepNames || []).filter((depName) => !classInfo.ignoreDeps?.includes(depName));

            if (this.beanPool.has(name)) {
                const existBean = this.beanPool.get(name);
                existBean.instance = instance;
                existBean.dependOns.push(...instanceDepNames);
                existBean.missingDepsCount = existBean.dependOns.length;
            } else {
                const newBean = new Bean({
                    name,
                    instance,
                    propagates: [],
                    dependOns: instanceDepNames,
                    missingDepsCount: instanceDepNames.length,
                });
                this.beanPool.set(name, newBean);
            }

            for (const depName of instanceDepNames) {
                if (this.beanPool.has(depName)) {
                    const existDepBean = this.beanPool.get(depName);
                    existDepBean.propagates.push(name);
                } else {
                    this.beanPool.set(depName, new Bean({
                        name: depName,
                        instance: null,
                        propagates: [name],
                        dependOns: [],
                        missingDepsCount: 0,
                    }));
                }
            }

            if (instanceDepNames.length === 0) {
                this.propagateQueue.push(this.beanPool.get(name));
            }
        }
    }

    ignite() {
        for (let bean = this.propagateQueue.shift(); bean; bean = this.propagateQueue.shift()) {
            const beans = bean.doPropagate(this.beanPool);
            for (const { instance } of beans) {
                if (instance.postInjection) {
                    instance.postInjection();
                }
            }
        }
    }

    startup() {
        this.prepare();
        this.ignite();
    }
}

module.exports = IOCContainer;
