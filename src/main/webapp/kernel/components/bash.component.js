// eslint-disable-next-line no-unused-vars
import EnvComponent from "./env.component";

const PATH_NAME = "PATH";

export default class BashComponent {
    /**
     * @param {EnvComponent} env
     */
    constructor(env) {
        this.env = env;
        this.env.set(PATH_NAME, new Map());
    }

    /**
     * @param {String} command
     */
    execute(command) {
        const args = command.split(/\s+/);
        const bin = args[0];
        const PATH = this.env.get(PATH_NAME);
        const executable = PATH.get(bin);
        if (!executable) {
            throw new Error(`command not found: "${command}"`);
        }
        const opts = {
            bin,
            args,
        };
        const output = executable.execute(command, opts);
        return output;
    }

    getEnv() {
        return this.env;
    }

    getPath() {
        return this.env.get(PATH_NAME);
    }
}
