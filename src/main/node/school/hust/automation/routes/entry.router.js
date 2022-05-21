const EntryStatus = require("../configs/entry-status");
const SafeError = require("../../../../global/exceptions/safe-error");
const DateTime = require("../../../../global/data/datetime");

class EntryRouter {
    entryDTO;

    entryController;

    entryValidation;

    serverUtils;

    postInjection() {
        this.insert = this.serverUtils.makeSafeHandler(this.insert, this);
        this.find = this.serverUtils.makeSafeHandler(this.find, this);
        this.update = this.serverUtils.makeSafeHandler(this.update, this);
    }

    async insert(req) {
        const entry = this.entryDTO.toEntryToInsert(req.body);
        entry.created = new DateTime(new Date());
        entry.status = EntryStatus.READY;
        this.entryValidation.checkUsernamePasswordActionId(entry);
        const result = await this.entryController.insert(entry);
        return result;
    }

    async update(req) {
        const entry = this.entryDTO.toEntryToUpdate(req.body);
        const { entryId } = req.params;
        this.entryValidation.checkUsernamePasswordActionId(entry);
        const result = await this.entryController.update(entryId, entry);
        return result;
    }

    async find(req) {
        const { username, password } = req.body;

        this.entryValidation.checkUsername(username);
        this.entryValidation.checkPassword(password);

        const result = await this.entryController.find({ username, password });

        if (result.length === 0) {
            throw new SafeError("Entry not found");
        }

        return result;
    }
}

module.exports = EntryRouter;
