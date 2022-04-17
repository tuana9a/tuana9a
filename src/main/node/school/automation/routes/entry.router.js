const serverUtils = require("../../../global/utils/server.utils");
const entryController = require("../controllers/entry.controller");
const entryDTO = require("../dto/entry.dto");
const entryValidation = require("../validations/entry.validation");
const EntryStatus = require("../configs/entry-status");
const SafeError = require("../../../global/exceptions/safe-error");

async function insert(req) {
    const entry = entryDTO.fromRequestBodyToEntry(req.body);
    entryValidation.checkUsernamePasswordActionId(entry);
    entry.status = EntryStatus.READY;
    const result = await entryController.insert(entry);
    return result;
}

async function update(req) {
    const entry = entryDTO.fromRequestBodyToEntry(req.body);
    const { entryId } = req.params;
    entryValidation.checkUsernamePasswordActionId(entry);
    const result = await entryController.update(entryId, entry);
    return result;
}

// eslint-disable-next-line no-unused-vars
async function find(req, resp) {
    // TODO: hiện tại chưa sử dụng
    // nếu dùng nhớ xóa password trước khi trả vè frontend
    throw new SafeError("not implemented");
}

module.exports = {
    find: serverUtils.makeSafeHandler(find),
    insert: serverUtils.makeSafeHandler(insert),
    update: serverUtils.makeSafeHandler(update),
};
