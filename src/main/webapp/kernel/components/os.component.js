/* eslint-disable no-param-reassign */
import BashComponent from "./bash.component";
import App from "./app.component";
import makeClickThenBringToFront from "../../common/styles/bring-to-front";
import makeDragToMove from "../../common/styles/make-drag-to-move";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../data/launch.option";
import WindowManagerComponent from "./window-manager.component";
import WindowComponent from "./window.component";
import BaseComponent from "../../global/components/base.component";
import EnvComponent from "./env.component";
import CONFIG from "../configs/config";

export default class OS extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("OS");
        this.windowManager = new WindowManagerComponent(document.createElement("div"));
        this.appendChild(this.windowManager);
        this.env = new EnvComponent();
        this.bash = new BashComponent(this.env);
        this.apps = new Map();
    }

    /**
     * @param {String} name
     * @param {LaunchOption} launchOption
     */
    install(name, AppClass, launchOption = {}) {
        this.apps.set(name, AppClass);
        const launcher = new BaseComponent(document.createElement("button"));
        launcher.getClassList().add("display-flex", "align-items-center");
        const launcherIcon = new BaseComponent(document.createElement("img"));
        launcherIcon.style({ width: "20px", height: "20px", padding: "3px" });
        launcherIcon.getElement().src = `https://avatars.dicebear.com/api/identicon/${name}.svg`;
        const launcherName = new BaseComponent(document.createElement("span"));
        launcherName.setInnerText(name);
        launcherName.style({ padding: "3px" });
        launcher.appendChild(launcherIcon, launcherName);
        // modify launch option
        launchOption.name = launchOption.name || name;
        launchOption.width = launchOption.width || CONFIG.DEFAULT.WINDOW.MIN_WIDTH;
        launchOption.height = launchOption.height || CONFIG.DEFAULT.WINDOW.MIN_HEIGHT;
        const thiss = this;
        launcher.addEventListener("click", () => {
            thiss.launch(name, launchOption);
        });
        this.windowManager.appendChild(launcher);
    }

    uninstall(name) {
        this.apps.delete(name);
    }

    /**
     * @param {String} name
     * @param {LaunchOption} launchOption
     */
    launch(name, launchOption) {
        const AppClass = this.apps.get(name);
        if (!AppClass) {
            throw new Error(`app not found: "${name}"`);
        }
        const app = new AppClass(document.createElement("div"));
        app.setEnv(this.env);
        app.setBash(this.bash);
        app.launch(launchOption);
        if (!(app instanceof App)) {
            throw new Error(`app "${AppClass}" is not a App`);
        }
        const window = new WindowComponent(document.createElement("div"));
        makeDragToMove(window, window.headerBar, {
            boundComponent: this.windowManager,
            boundLeft: true,
            boundTop: true,
        });
        makeClickThenBringToFront(window);
        window.launch(launchOption, app);
        window.body.appendChild(app);
        window.moveTo(launchOption.x, launchOption.y);
        this.windowManager.appendChild(window);
        return window.id;
    }

    kill(id) {
        this.windowManager.removeChildById(id);
    }
}
