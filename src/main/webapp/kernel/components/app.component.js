// eslint-disable-next-line no-unused-vars
import LaunchOption from "../data/launch.option";
import BaseComponent from "../../global/components/base.component";

export default class App extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("App");
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        this.launchOption = launchOption;
    }

    // eslint-disable-next-line class-methods-use-this
    exit() {
        // TODO: free up resource eg: remove env listener
    }
}
