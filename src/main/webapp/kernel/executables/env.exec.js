/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import BaseExec from "./base.exec";

export default class EnvExec extends BaseExec {
    constructor(init) {
        super(init);
        this.handlers.set("set", this.set.bind(this));
        this.handlers.set("get", this.get.bind(this));
        const show = this.show.bind(this);
        this.handlers.set("", show);
        this.handlers.set("show", show);
        this.handlers.set("print", show);
        this.handlers.set(null, show);
        this.handlers.set(undefined, show);
    }

    set(args) {
        const [, , key, value] = args;
        this.os.env.set(key, value);
        return value;
    }

    get(args) {
        const [, , key] = args;
        return this.os.env.get(key);
    }

    show() {
        const tree = this.os.env.tree();
        let msg = "";
        for (const key in tree) {
            let value = tree[key];
            if (key === "file") {
                value = value.name;
            } else if (key === "files") {
                value = value.map((x) => x.name);
            } else if (key === "classIds") {
                value = Array.from(value);
            }
            msg += `<span class="color-red">${key}</span> = ${value}<br/>`;
        }
        return msg;
    }

    execute(command) {
        const args = command.trim().split(/\s+/);
        const handler = this.handlers.get(args[1]);
        if (!handler) {
            throw new Error(`command not found: "${command}"`);
        }
        return handler(args);
    }
}
