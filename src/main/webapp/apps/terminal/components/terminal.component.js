/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import ScreenComponent from "./screen.component";
import TypingComponent from "./typing.component";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../../../kernel/data/launch.option";
import App from "../../../kernel/components/app.component";
import OutputComponent from "./output.component";
import { dce } from "../../../global/utils/dom.utils";
import LOGGER from "../../../global/loggers/logger";

export default class TerminalComponent extends App {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        const thiss = this;
        this.getClassList().add("Terminal");

        this.screen = new ScreenComponent(document.createElement("div"));
        this.console = new OutputComponent(dce("div"));
        this.typing = new TypingComponent(document.createElement("div"));
        this.history = [];
        this.selectingHistoryIndex = 0;

        this.console.getClassList().add("Console");
        this.typing.input.addEventListener("keydown", (e) => thiss.onKeyDown(e));
        this.typing.input.addEventListener("input", (e) => thiss.onInput(e));
        this.screen.addEventListener("click", () => thiss.typing.input.focus(), { capture: true });

        this.onkeydownHandlers = new Map();
        this.onkeydownHandlers.set("Enter", (e) => thiss.onPressEnter(e));
        this.onkeydownHandlers.set("Tab", (e) => thiss.onPressTab(e));
        this.onkeydownHandlers.set("ArrowUp", (e) => thiss.onPressArrowUp(e));
        this.onkeydownHandlers.set("ArrowDown", (e) => thiss.onPressArrowDown(e));

        this.screen.appendChild(this.console);
        this.screen.appendChild(this.typing);
        this.appendChild(this.screen);
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        super.launch(launchOption);
        if (launchOption.dropFile) {
            const thiss = this;
            // prevent default drop effect
            this.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            this.addEventListener("drop", (e) => {
                e.preventDefault();
                thiss.onDrop(e);
            });
        }
    }

    /**
     * @param {Event} e
     */
    onKeyDown(e) {
        const { key } = e;
        const handler = this.onkeydownHandlers.get(key);
        if (!handler) {
            return;
        }
        handler(e);
    }

    onInput() {
        const value = this.typing.getValue();
        const args = value.trim().split(/\s+/);
        this.typing.suggest.reset();
        this.typing.suggest.render(args, value);
    }

    /**
     * @param {Event} e
     */
    onPressEnter(e) {
        e.preventDefault();
        const command = this.typing.getValue();
        this.typing.suggest.reset();
        this.typing.setValue("");
        // check if empty command
        if (command.match(/^\s*$/)) {
            return;
        }
        this.console.appendCommand(this.typing.prefixContainer.getInnerText(), command);
        try {
            const outputs = this.notifyParent("i:bash:execute", { command });
            if (outputs) {
                if (!Array.isArray(outputs)) {
                    throw new Error("i:bash:execute must return an array");
                }
                if (outputs.length > 1) {
                    LOGGER.warn("i:bash:execute return an array with more than one element");
                }
                for (const output of outputs) {
                    this.console.appendOutput(output);
                }
            }
        } catch (err) {
            LOGGER.error(err);
            this.console.appendOutput(err.message);
        }
        this.history.push(command);
        for (const word of command.split(/\s+/)) {
            this.typing.suggest.addWord(word);
        }
    }

    /**
     * @param {Event} e
     */
    onPressTab(e) {
        e.preventDefault();
        const value = this.typing.suggest.choose();
        if (!value) return;
        this.typing.setValue(value);
        this.typing.suggest.reset();
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
    onDrop(e) {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        this.notifyParent("i:env:set", { key: "files", value: files });
        const file = files[0];
        if (!file) {
            this.console.appendOutput("no file droped");
            return;
        }
        const fileNames = files.map((x) => x.name);
        this.console.appendOutput(`drop: ${fileNames}`);
    }
}
