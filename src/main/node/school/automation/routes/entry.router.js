const express = require("express");

const rateLimit = require("../middlewares/rate-limit");
const serverUtils = require("../../../global/utils/server.utils");
const entryController = require("../controllers/entry.controller");
const entryDTO = require("../dto/entry.dto");
const entryValidation = require("../validations/entry.validation");
const EntryStatus = require("../configs/entry-status");

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

async function find(req, resp) {
    // TODO: hiện tại chưa sử dụng
    // nếu dùng nhớ xóa password trước khi trả vè frontend
    resp.send("Under construction");
}

const router = express.Router();
router.get("/", serverUtils.wrapper(find));
router.post("/", rateLimit.submitEntry, serverUtils.wrapper(insert));
router.put("/:entryId", rateLimit.submitEntry, serverUtils.wrapper(update));

module.exports = router;
