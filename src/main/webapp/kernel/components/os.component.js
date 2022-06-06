/* eslint-disable no-param-reassign */
import BashComponent from "./bash.component";
// eslint-disable-next-line no-unused-vars
import LaunchOption from "../data/launch.option";
import WindowManagerComponent from "./window-manager.component";
import WindowComponent from "./window.component";
import BaseComponent from "../../global/components/base.component";
import EnvComponent from "./env.component";
import CONFIG from "../configs/config";
import { dce } from "../../global/utils/dom.utils";
import styleUtils from "../../common/utils/style.utils";

export default class OS extends BaseComponent {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super(element);
        this.getClassList().add("OS");
        this.windowManager = new WindowManagerComponent(dce("div"));
        this.appendChild(this.windowManager);
        this.env = new EnvComponent();
        this.env.set("PATH", new Map());
        this.bash = new BashComponent(this.env);
        this.apps = new Map();
        this.addNotifyListener("close", ({ id }) => this.kill(id));
        this.addNotifyListener("i:env:get", ({ key }) => this.env.get(key));
        this.addNotifyListener("i:env:set", ({ key, value }) => this.env.set(key, value));
        this.addNotifyListener("i:bash:execute", ({ command }) => {
            const bin = this.getBin(command.trim().split(/\s+/)[0]);
            return this.bash.execute({ os: this, command, bin });
        });
    }

    /**
     * @param {String} name
     * @param {LaunchOption} launchOption
     */
    install(name, AppClass, launchOption = {}) {
        this.apps.set(name, AppClass);
        const launcher = new BaseComponent(dce("button"));
        launcher.getClassList().add("display-flex", "align-items-center");
        const launcherIcon = new BaseComponent(dce("img"));
        launcherIcon.style({ width: "20px", height: "20px", padding: "3px" });
        launcherIcon.getElement().src = `https://avatars.dicebear.com/api/identicon/${name}.svg`;
        const launcherName = new BaseComponent(dce("span"));
        launcherName.setInnerText(name);
        launcherName.style({ padding: "3px" });
        launcher.appendChild(launcherIcon, launcherName);
        // modify launch option
        launchOption.name = launchOption.name || name;
        launchOption.width = launchOption.width || CONFIG.DEFAULT.WINDOW.MIN_WIDTH;
        launchOption.height = launchOption.height || CONFIG.DEFAULT.WINDOW.MIN_HEIGHT;
        const launch = this.launch.bind(this);
        launcher.addEventListener("click", () => launch(name, launchOption));
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
        const app = new AppClass(dce("div"));
        if (!(app instanceof WindowComponent)) {
            throw new Error(`app "${AppClass}" is not a WindowComponent`);
        }
        app.launch(launchOption);
        app.moveTo(launchOption.x, launchOption.y);
        styleUtils.makeDragToMove(app, app.head, {
            boundComponent: this.windowManager,
            boundLeft: true,
            boundTop: true,
            // boundRight: true,
            // boundBottom: true,
        });
        styleUtils.makeClickThenBringToFront(app, this.windowManager);
        this.windowManager.appendChild(app);
        return app.id;
    }

    getBin(bin) {
        return this.env.get("PATH").get(bin);
    }

    addBin(bin, executable) {
        this.env.get("PATH").set(bin, executable);
    }

    kill(id) {
        this.windowManager.removeChildById(id);
    }
}
