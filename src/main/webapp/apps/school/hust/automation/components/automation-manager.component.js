import BaseComponent from "../../../../../global/components/base.component";
import LOGGER from "../../../../../global/loggers/logger";
import { dce } from "../../../../../global/utils/dom.utils";
import WindowComponent from "../../../../../kernel/components/window.component";
import entryApis from "../apis/entry.apis";
import EntryFormComponent from "./entry-form.component";

export default class AutomationManagerComponent extends WindowComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("Form");
        this.entryForm = new EntryFormComponent(dce("div"));
        this.submitEntryButton = new BaseComponent(dce("button"));
        this.submitCancelButton = new BaseComponent(dce("button"));
        this.queryEntriesButton = new BaseComponent(dce("button"));
        this.output = new BaseComponent(dce("div"));

        this.submitEntryButton.setInnerText("Submit Entry");
        this.submitCancelButton.setInnerText("Submit Cancel");
        this.queryEntriesButton.setInnerText("Query Entries");

        this.submitEntryButton.addEventListener("click", this.onSubmitEntry.bind(this));
        this.submitCancelButton.addEventListener("click", this.onCancel.bind(this));
        this.queryEntriesButton.addEventListener("click", this.onQuery.bind(this));

        this.body.appendChild(this.entryForm);
        this.body.appendChild(this.submitEntryButton);
        this.body.appendChild(this.submitCancelButton);
        this.body.appendChild(this.queryEntriesButton);
        this.body.appendChild(this.output);
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

    async onQuery() {
        const form = this.entryForm;
        const username = form.username.input.getValue();
        const password = form.password.input.getValue();

        const response = await entryApis.find({ username, password });
        this.appendResponse(response);
    }

    appendResponse(response) {
        const content = JSON.stringify(response, null, 2);
        const entry = new BaseComponent(dce("pre"));
        entry.setInnerText(content);
        this.output.appendChild(entry);
    }
}
