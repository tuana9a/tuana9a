import BaseComponent from "../../../global/components/base.component";

export default class ScreenComponent extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("TerminalScreen");
    }

    // eslint-disable-next-line class-methods-use-this
    prefixNow() {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        second = second < 10 ? `0${second}` : second;
        return `${hour}:${minute}:${second}`;
    }

    /**
     * @param {String} value
     */
    appendCommand(value) {
        const { element } = this;
        const commandComponent = new BaseComponent(document.createElement("div"));
        commandComponent.getClassList().add("CommandMessage");
        const messageTime = new BaseComponent(document.createElement("span"));
        messageTime.innerText(this.prefixNow());
        messageTime.getClassList().add("MessageTime");
        const messageContent = new BaseComponent(document.createElement("span"));
        messageContent.innerText(value);
        messageContent.getClassList().add("MessageContent");
        const copyButton = new BaseComponent(document.createElement("button"));
        copyButton.innerText("copy");
        copyButton.getClassList().add("CopyButton");
        copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(value);
        });
        commandComponent.appendChild(messageTime);
        commandComponent.appendChild(messageContent);
        commandComponent.appendChild(copyButton);
        this.appendChild(commandComponent);
        element.scrollTo(0, element.scrollHeight);
    }

    /**
     * @param {String} message
     * @param {String} style
     */
    appendResponse(message, style) {
        const screenTag = this.element;
        const div = document.createElement("div");
        div.classList.add("ResponseMessage");
        let html = "";
        html += `<span class="MessageTime">${this.prefixNow()}</span>`;
        html += `<pre class="MessageContent" style="${style}">${message}</pre>`;
        div.innerHTML = html;
        screenTag.appendChild(div);
        screenTag.scrollTo(0, screenTag.scrollHeight);
    }

    appendResponseJson(message = {}) {
        this.appendResponse(JSON.stringify(message, null, "  "));
    }

    cls() {
        this.innerHTML("");
    }
}
