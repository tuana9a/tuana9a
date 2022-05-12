import BaseComponent from "../../../../../global/components/base.component";
import LOGGER from "../../../../../global/loggers/logger";
import { dce } from "../../../../../global/utils/dom.utils";
import App from "../../../../../kernel/components/app.component";
import entryApis from "../apis/entry.apis";
import EntryFormComponent from "./entry-form.component";

export default class AutomationManagerComponent extends App {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("Form");
        this.entryForm = new EntryFormComponent(dce("div"));
        this.submitEntryButton = new BaseComponent(dce("button"));
        this.submitCancelButton = new BaseComponent(dce("button"));
        this.output = new BaseComponent(dce("div"));

        this.submitEntryButton.setInnerText("Submit Entry");
        this.submitCancelButton.setInnerText("Submit Cancel");

        const thiss = this;
        this.submitEntryButton.addEventListener("click", () => {
            thiss.onSubmitEntry();
        });
        this.submitCancelButton.addEventListener("click", () => {
            thiss.onCancel();
        });

        this.appendChild(this.entryForm);
        this.appendChild(this.submitEntryButton);
        this.appendChild(this.submitCancelButton);
        this.appendChild(this.output);
    }

    async onSubmitEntry() {
        const form = this.entryForm;
        const username = form.username.input.getValue();
        const password = form.password.input.getValue();
        const actionId = form.actionId.select.getValue();
        // month start from 0 no need second param
        const timeToStart = new Date(form.timeToStart.input.getValue()).getTime();
        const classIds = form.classIds.input
            .getValue()
            .trim()
            .split(/\s+/)
            .map((x) => String(x));
        const entry = {
            username,
            password,
            actionId,
            classIds,
            timeToStart,
        };
        const response = await entryApis.insert({ entry });
        LOGGER.info(response);
        this.appendResponse(response);
        if (response.code) {
            const payload = response.data;
            form.entryId.input.setValue(payload.entryId);
            form.historyId.input.setValue(payload.historyId);
        }
    }

    async onCancel() {
        const form = this.entryForm;
        const entryId = form.entryId.input.getValue();
        const username = form.username.input.getValue();
        const password = form.password.input.getValue();
        const actionId = form.actionId.select.getValue();
        const entry = {
            _id: entryId,
            username,
            password,
            actionId, // not used but required to validate entry
        };
        const response = await entryApis.cancel({ entryId, entry });
        LOGGER.info(response);
        this.appendResponse(response);
    }

    appendResponse(response) {
        const content = JSON.stringify(response, null, 2);
        const entry = new BaseComponent(dce("pre"));
        entry.setInnerText(content);
        this.output.appendChild(entry);
    }
}
