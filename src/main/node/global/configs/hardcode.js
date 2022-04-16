module.exports = {
    collection: {
        school: {
            classes: "school.classes",
            automation: {
                entries: "school.automation.entries",
                history: "school.automation.history",
            },
        },
    },
    rateLimit: {
        automation: {
            windowMs: 5 * 60 * 1000,
            max: 5,
        },
    },
    logsDir: "logs/",
};
