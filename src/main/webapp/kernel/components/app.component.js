// eslint-disable-next-line no-unused-vars
import LaunchOption from "../data/launch.option";
// eslint-disable-next-line no-unused-vars
import EnvComponent from "./env.component";
// eslint-disable-next-line no-unused-vars
import BashComponent from "./bash.component";
import BaseComponent from "../../global/components/base.component";

export default class App extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.classList().add("Program");
    }

    /**
     * @param {EnvComponent} env
     */
    setEnv(env) {
        this.env = env;
    }

    /**
     * @param {BashComponent} bash
     */
    setBash(bash) {
        this.bash = bash;
    }

    /**
     * @param {LaunchOption} launchOption
     */
    launch(launchOption) {
        this.launchOption = launchOption;
    }

    // eslint-disable-next-line class-methods-use-this
    exit() {
        // TODO: free up resource eg: remove env listener belong to this program
    }
}
