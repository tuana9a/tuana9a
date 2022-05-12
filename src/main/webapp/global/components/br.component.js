import { dce } from "../utils/dom.utils";
import BaseComponent from "./base.component";

export default class BrComponent extends BaseComponent {
    constructor() {
        super(dce("br"));
    }
}
