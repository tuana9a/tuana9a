const serverUtils = require("../../../../global/utils/server.utils");
const entryController = require("../controllers/entry.controller");
const entryDTO = require("../dto/entry.dto");
const entryValidation = require("../validations/entry.validation");
const EntryStatus = require("../configs/entry-status");
const SafeError = require("../../../../global/exceptions/safe-error");
const DateTime = require("../../../../global/data/datetime");

async function insert(req) {
    const entry = entryDTO.toEntryToInsert(req.body);
    entry.created = new DateTime(new Date());
    entry.status = EntryStatus.READY;
    entryValidation.checkUsernamePasswordActionId(entry);
    const result = await entryController.insert(entry);
    return result;
}

async function update(req) {
    const entry = entryDTO.toEntryToUpdate(req.body);
    const { entryId } = req.params;
    entryValidation.checkUsernamePasswordActionId(entry);
    const result = await entryController.update(entryId, entry);
    return result;
}

// eslint-disable-next-line no-unused-vars
async function find(req, resp) {
    const { username, password } = req.body;

    entryValidation.checkUsername(username);
    entryValidation.checkPassword(password);

    const result = await entryController.find({ username, password });

    if (result.length === 0) {
        throw new SafeError("Entry not found");
    }

    return result;
}

module.exports = {
    find: serverUtils.makeSafeHandler(find),
    insert: serverUtils.makeSafeHandler(insert),
    update: serverUtils.makeSafeHandler(update),
};
