const axios = require("axios");
const CONFIG = require("../configs/config");

class BotClient {
    constructor() {
        this.mapper = new Map();
    }

    getJobId(actionId) {
        return this.mapper.get(actionId);
    }

    setJobId(actionId, jobId) {
        this.mapper.set(actionId, jobId);
    }

    async send(entry) {
        const body = {
            jobId: this.getJobId(entry.actionId),
            data: entry,
        };
        const { url } = CONFIG.automation.bot;
        return axios
            .post(url, body, {
                headers: {
                    secret: CONFIG.automation.bot.secret,
                },
            })
            .then((res) => res.data);
    }
}

const botClient = new BotClient();

module.exports = botClient;
