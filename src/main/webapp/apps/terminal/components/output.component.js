import BaseComponent from "../../../global/components/base.component";
import { dce } from "../../../global/utils/dom.utils";

export default class OutputComponent extends BaseComponent {
    appendCommand(prefixValue, commandValue) {
        const command = new BaseComponent(dce("div"));
        command.getClassList().add("Command");
        const prefix = new BaseComponent(dce("span"));
        prefix.getClassList().add("Prefix");
        prefix.setInnerText(prefixValue);
        const content = new BaseComponent(dce("span"));
        content.setInnerText(commandValue);
        content.getClassList().add("Content");
        command.appendChild(prefix, content);
        this.appendChild(command);
    }

    appendOutput(outputValue) {
        const output = new BaseComponent(dce("div"));
        output.getClassList().add("Output");
        const content = new BaseComponent(dce("pre"));
        content.getClassList().add("Content");
        content.setInnerText(outputValue);
        output.appendChild(content);
        this.appendChild(output);
    }

    clear() {
        this.setInnerHTML("");
    }
}
