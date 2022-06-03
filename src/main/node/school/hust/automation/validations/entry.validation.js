/* eslint-disable class-methods-use-this */
const SafeError = require("../../../../global/exceptions/safe-error");

class EntryValidation {
    arrayValidation;

    CONFIG;

    checkUsername(username) {
        if (!username || username.match(/^\s+$/) || username.length < 8) {
            throw new SafeError("username is missing or wrong format");
        }
    }

    checkPassword(password) {
        if (!password || password.match(/^\s+$/)) {
            throw new SafeError("password is missing or wrong format");
        }
    }

    checkActionId(actionId) {
        if (!this.CONFIG.automation.allowedActions.has(actionId)) {
            throw new SafeError("actionId not allowed");
        }
    }

    checkUsernamePasswordActionId(entry) {
        this.checkUsername(entry.username);
        this.checkPassword(entry.password);
        this.checkActionId(entry.actionId);
    }

    checkUsernamePassword(entry) {
        this.checkUsername(entry.username);
        this.checkPassword(entry.password);
    }

    checkActionIdTimeTable(actionId) {
        if (actionId !== this.CONFIG.automation.getStudentTimetableId) {
            throw new SafeError("actionId not match");
        }
    }

    checkActionIdAutoRegister(actionId) {
        if (actionId !== this.CONFIG.automation.autoRegisterClassesId) {
            throw new SafeError("actionId not match");
        }
    }

    /**
     * @param {String[]} classIds
     */
    checkClassIds(classIds) {
        if (!classIds) {
            throw new SafeError("classIds is missing");
        }
        this.arrayValidation.isArray(classIds, { name: "classIds" });
        if (classIds.length === 0) {
            throw new SafeError("classIds is empty");
        }
        for (const classId of classIds) {
            if (typeof classId !== "string") {
                throw new SafeError("classIds must be string");
            }
        }
    }
}

module.exports = EntryValidation;
