export default class BashComponent {
    // eslint-disable-next-line class-methods-use-this
    execute({ bin, command, os }) {
        const Executable = bin;
        if (!Executable) {
            return `command not found: "${command}"`;
        }
        const exec = new Executable({ command, os });
        const output = exec.execute(command);
        exec.exit();
        return output;
    }
}
