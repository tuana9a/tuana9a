/* eslint-disable class-methods-use-this */
const SafeError = require("../../../../global/exceptions/safe-error");

class EntryValidation {
    arrayValidation;

    AUTOMATION_CONFIG;

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
        if (!this.AUTOMATION_CONFIG.allowedActions.has(actionId)) {
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
        if (actionId !== this.AUTOMATION_CONFIG.actionIds.getStudentTimetable) {
            throw new SafeError("actionId not match");
        }
    }

    checkActionIdAutoRegister(actionId) {
        if (actionId !== this.AUTOMATION_CONFIG.actionIds.autoRegisterClasses) {
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
        // eslint-disable-next-line no-restricted-syntax
        for (const classId of classIds) {
            if (typeof classId !== "string") {
                throw new SafeError("classIds must be string");
            }
        }
    }
}

module.exports = EntryValidation;
