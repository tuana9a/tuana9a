const puppeteer = require("puppeteer");

class PuppeteerManager {
    logger;

    /**
     * @param {puppeteer.LaunchOptions} launchOption
     */
    async launch(launchOption) {
        this.browser = await puppeteer.launch(launchOption);
        this.browser.on("disconnected", this.onDisconnected.bind(this));
        return this;
    }

    onDisconnected() {
        this.logger.error(new Error("puppeteer browser disconnected"));
        process.exit(0);
    }

    getBrowser() {
        return this.browser;
    }

    async getPageByIndex(index) {
        const tabs = await this.browser.pages();
        return tabs[index];
    }
}

module.exports = PuppeteerManager;
