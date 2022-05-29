const TransformObject = require("../../../../global/data/transform-object");
// eslint-disable-next-line no-unused-vars
const Entry = require("../data/entry");

class EntryDTO {
    numberDTO;

    stringDTO;

    /**
     * @param {*} object
     * @returns {Entry}
     */
    toEntryToInsert(object) {
        const { numberDTO, stringDTO } = this;
        const entry = new TransformObject(object, { numberDTO, stringDTO })
            .pickProps([
                "username",
                "password",
                "actionId",
                "classIds",
                "timeToStart",
                // insert entry not take status value
            ])
            .normalizeStringProp("username")
            .normalizeStringProp("password")
            .normalizeStringProp("actionId")
            .normalizeArrayProp("classIds", { type: "string", default: true })
            .normalizeIntProp("timeToStart")
            .replaceIntWithDateTime("timeToStart")
            .collect();
        return entry;
    }

    /**
     * @param {*} object
     * @returns {Entry}
     */
    toEntryToUpdate(object) {
        const { numberDTO, stringDTO } = this;
        const entry = new TransformObject(object, { numberDTO, stringDTO })
            .pickProps([
                "username",
                "password",
                "newUsername",
                "newPassword",
                "actionId",
                "classIds",
                "timeToStart",
                "status",
            ])
            .normalizeStringProp("username")
            .normalizeStringProp("newUsername")
            .normalizeStringProp("password")
            .normalizeStringProp("newPassword")
            .normalizeArrayProp("classIds", { type: "string" })
            .normalizeStringProp("actionId")
            .normalizeIntProp("timeToStart")
            .normalizeStringProp("status")
            .replaceIntWithDateTime("timeToStart")
            .collect();
        return entry;
    }

    /**
     * mapper cho chuẩn với frontend
     * @param {Entry} entry
     */
    toClient(entry) {
        const { numberDTO, stringDTO } = this;
        const output = new TransformObject(entry, { numberDTO, stringDTO })
            .dropProps(["password"])
            .collect();
        return output;
    }
}

module.exports = EntryDTO;
