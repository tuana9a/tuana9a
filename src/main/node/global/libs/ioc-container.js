/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */

const Bean = require("./bean");

class IOCContainer {
    constructor() {
        this.beanPool = new Map();
        this.classInfoPool = new Map();
    }

    addClassInfo(name, Classs, dependOns = [], ignoreDeps = [], autowired = true) {
        this.classInfoPool.set(name, { name, Classs, dependOns, ignoreDeps, autowired });
    }

    addZeroDependencyBean(name, instance) {
        if (this.beanPool.has(name)) {
            const existBean = this.beanPool.get(name);
            existBean.instance = instance;
            return;
        }
        const newBean = new Bean({
            name,
            instance,
            injectTos: [],
            dependOns: [],
            missingDepsCount: 0,
        });
        this.beanPool.set(name, newBean);
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
                    injectTos: [],
                    dependOns: instanceDepNames,
                    missingDepsCount: instanceDepNames.length,
                });
                this.beanPool.set(name, newBean);
            }

            for (const depName of instanceDepNames) {
                if (this.beanPool.has(depName)) {
                    const existDepBean = this.beanPool.get(depName);
                    existDepBean.injectTos.push(name);
                } else {
                    this.beanPool.set(depName, new Bean({
                        name: depName,
                        instance: null,
                        injectTos: [name],
                        dependOns: [],
                        missingDepsCount: 0,
                    }));
                }
            }
        }
    }

    inject() {
        for (const bean of this.beanPool.values()) {
            const { name, injectTos } = bean;
            for (const targetBeanName of injectTos) {
                this.injectFromTo(name, targetBeanName);
            }
        }
    }

    injectFromTo(from, target, name) {
        const propName = name || from;
        const fromBean = this.beanPool.get(from);
        const targetBean = this.beanPool.get(target);
        const { instance: targetInstance } = targetBean;
        const { instance } = fromBean;
        targetBean.missingDepsCount -= 1;
        targetInstance[propName] = instance;
        if (targetBean.missingDepsCount === 0) {
            if (targetInstance.postInjection) {
                targetInstance.postInjection();
            }
        }
    }

    startup() {
        this.prepare();
        this.inject();
    }
}

module.exports = IOCContainer;
