const DateTime = require("../../../../global/data/datetime");
const numberDTO = require("../../../../global/dto/number.dto");
const BaseTransform = require("../../../../global/transforms/base.transform");
const NormalizeIntProp = require("../../../../global/transforms/normalize-int-prop");
const NormalizeStringProp = require("../../../../global/transforms/normalize-string-prop");
const PickProp = require("../../../../global/transforms/pick-prop");

module.exports = {
    normalize: {
        username: NormalizeStringProp("username"),
        password: NormalizeStringProp("password"),
        newUsername: NormalizeStringProp("newUsername"),
        newPassword: NormalizeStringProp("newPassword"),
        actionId: NormalizeStringProp("actionId"),
        timeToStart: NormalizeIntProp("timeToStart"),
        status: NormalizeStringProp("status"),
    },
    replace: {
        timeToStart: new BaseTransform((object) => {
            // eslint-disable-next-line no-param-reassign
            object.timeToStart = new DateTime(new Date(numberDTO.toInt(object.timeToStart)));
            return object;
        }),
    },
    pickProp: {
        entryToInsert: PickProp([
            "username",
            "password",
            "actionId",
            "classIds",
            "timeToStart",
            // insert entry not take status value
        ]),
        entryToUpdate: PickProp([
            "username",
            "password",
            "newUsername",
            "newPassword",
            "actionId",
            "classIds",
            "timeToStart",
            "status",
        ]),
    },
};
