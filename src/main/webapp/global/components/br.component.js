import BaseComponent from "./base.component";

export default class BrComponent extends BaseComponent {
    constructor() {
        super(document.createElement("br"));
    }
}
