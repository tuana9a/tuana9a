/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import ScreenComponent from "./screen.component";
import TypingComponent from "./typing.component";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../../../kernel/data/launch.option";
import App from "../../../kernel/components/app.component";

export default class TerminalComponent extends App {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        const thiss = this;
        this.getClassList().add("Terminal");
        // create screen component and typing
        this.screen = new ScreenComponent(document.createElement("div"));
        this.appendChild(this.screen);
        // init typing component
        this.typing = new TypingComponent(document.createElement("div"));
        this.typing.input.addEventListener("keydown", (e) => thiss.onKeyDown(e));
        this.appendChild(this.typing);
        // init event on terminal
        this.onkeydownHandlers = new Map();
        this.onkeydownHandlers.set("Enter", (e) => thiss.onPressEnter(e));
        this.onkeydownHandlers.set("Tab", (e) => thiss.onPressTab(e));
        this.onkeydownHandlers.set("ArrowUp", (e) => thiss.onPressArrowUp(e));
        this.onkeydownHandlers.set("ArrowDown", (e) => thiss.onPressArrowDown(e));
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        super.launch(launchOption);
        if (launchOption.dropFile) {
            const thiss = this;
            // prevent default drop effect
            // window.addEventListener("dragover", (e) => e.preventDefault());
            // handler drop effect
            this.addEventListener("drop", (e) => thiss.ondrop(e));
        }
    }

    /**
     * @param {String} bin
     */
    // eslint-disable-next-line no-console
    addCommand(bin, executable = { execute: (command, opts = { bin: "", args: [""] }) => console.log(command, opts) }) {
        this.bash.getPath().set(bin, executable);
    }

    initBaseCommand() {
        const thiss = this;
        // base terminal commands
        this.addCommand("set", {
            execute(_, { args }) {
                const key = args[0];
                const value = args.slice(1).join(" ");
                thiss.env.set(key, value);
            },
        });
        this.addCommand("get", {
            execute(_, { args }) {
                const key = args[0];
                const value = thiss.env.get(key);
                thiss.screen.appendResponse(value);
            },
        });
        this.addCommand("env", {
            execute() {
                const tree = thiss.env.tree();
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
                thiss.screen.appendResponse(msg);
            },
        });
        this.addCommand("cls", {
            execute() {
                thiss.screen.cls();
            },
        });
        this.addCommand("help", {
            execute() {
                const { tree } = thiss.bash;
                let msg = "";
                for (const key in tree) {
                    msg += `${key}\n`;
                }
                thiss.screen.appendResponse(msg);
            },
        });
    }

    /**
     * @param {String} bin
     */
    getCommand(bin) {
        return this.bash.getPath().get(bin);
    }

    /**
     * @param {String} command
     */
    // eslint-disable-next-line class-methods-use-this
    getComandArgs(command) {
        return command.trim().split(/\s+/);
    }

    /**
     * @param {Event} e
     */
    onKeyDown(e) {
        const { key } = e;
        const handler = this.onkeydownHandlers.get(key);
        if (handler) {
            handler(e);
            return;
        }
        // if not, render other thing
        const thiss = this;
        setTimeout(() => {
            const typingValue = thiss.typing.value();
            const args = thiss.getComandArgs(typingValue);
            thiss.typing.suggest.reset();
            thiss.typing.suggest.render(args, typingValue);
        }, 0);
    }

    /**
     * @param {Event} e
     */
    onPressEnter(e) {
        e.preventDefault();
        const typingComponent = this.typing;
        const screenComponent = this.screen;
        const command = typingComponent.value();
        typingComponent.suggest.reset();
        typingComponent.set("");
        // check if empty command
        if (command.match(/^\s*$/)) {
            return;
        }
        screenComponent.appendCommand(command);
        const response = this.bash.execute(command);
        // if response is succes then no need to append message feed back
        if (response) {
            // has error message
            screenComponent.appendResponse(response);
            return;
        }
        typingComponent.suggest.addHistory(command);
        for (const word of command.split(/\s+/)) {
            typingComponent.suggest.addWord(word);
        }
    }

    /**
     * @param {Event} e
     */
    onPressTab(e) {
        e.preventDefault();
        const typingComponent = this.typing;
        const value = typingComponent.suggest.choose();
        if (!value) return;
        typingComponent.set(value);
        typingComponent.suggest.reset();
    }

    /**
     * @param {Event} e
     */
    onPressArrowUp(e) {
        e.preventDefault();
        this.typing.suggest.toggle(-1);
    }

    onPressArrowDown(e) {
        e.preventDefault();
        this.typing.suggest.toggle(1);
    }

    /**
     * @param {Event} e
     */
    async ondrop(e) {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        this.env.set("files", files);
        const file = files[0];
        if (!file) {
            this.screen.appendResponse("no file droped");
            return;
        }
        this.env.set("file", file);
        if (file.name.endsWith(".json")) {
            const fileJson = JSON.parse(await file.text());
            this.env.set("file-json", fileJson);
        }
        const fileNames = files.map((x) => x.name);
        this.screen.appendResponse(`drop: ${fileNames}`);
    }
}
