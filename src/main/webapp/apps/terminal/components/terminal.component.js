/* eslint-disable guard-for-in */
import ScreenComponent from "./screen.component";
import TypingComponent from "./typing.component";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../../../kernel/data/launch.option";
import WindowComponent from "../../../kernel/components/window.component";
import OutputComponent from "./output.component";
import { dce } from "../../../global/utils/dom.utils";
import LOGGER from "../../../global/loggers/logger";

export default class TerminalComponent extends WindowComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("Terminal");

        this.screen = new ScreenComponent(dce("div"));
        this.console = new OutputComponent(dce("div"));
        this.typing = new TypingComponent(dce("div"));
        this.history = [];
        this.selectingHistoryIndex = 0;

        this.console.getClassList().add("Console");
        this.typing.input.addEventListener("keydown", this.onKeyDown.bind(this));
        this.typing.input.addEventListener("input", this.onInput.bind(this));
        this.screen.addEventListener("click", this.typing.input.focus.bind(this.typing.input), { capture: true });

        this.onkeydownHandlers = new Map();
        this.onkeydownHandlers.set("Enter", this.onPressEnter.bind(this));
        this.onkeydownHandlers.set("Tab", this.onPressTab.bind(this));
        this.onkeydownHandlers.set("ArrowUp", this.onPressArrowUp.bind(this));
        this.onkeydownHandlers.set("ArrowDown", this.onPressArrowDown.bind(this));

        this.screen.appendChild(this.console);
        this.screen.appendChild(this.typing);
        this.body.appendChild(this.screen);
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        super.launch(launchOption);
        if (launchOption.dropFile) {
            // prevent default drop effect
            this.addEventListener("dragover", (e) => e.preventDefault());
            this.addEventListener("drop", this.onDrop.bind(this));
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
