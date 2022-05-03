/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import BaseExec from "./base.exec";

export default class EnvExec extends BaseExec {
    constructor(init) {
        super(init);
        const thiss = this;
        this.handlers.set("set", (args) => {
            const [, , key, value] = args;
            thiss.os.env.set(key, value);
            return value;
        });
        this.handlers.set("get", (args) => {
            const [, , key] = args;
            return thiss.os.env.get(key);
        });
        const print = () => {
            const tree = thiss.os.env.tree();
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
                msg += `<span class="color-violet">${key}</span> = ${value}<br/>`;
            }
            return msg;
        };
        this.handlers.set("", print);
        this.handlers.set(null, print);
        this.handlers.set(undefined, print);
        this.handlers.set("print", print);
        this.handlers.set("show", print);
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
