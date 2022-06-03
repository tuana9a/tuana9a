const EntryStatus = require("../data/entry-status");
const SafeError = require("../../../../global/exceptions/safe-error");
const DateTime = require("../../../../global/data/datetime");
const HttpStatusCode = require("../../../../global/data/http-status-code");

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
        const { authorization } = req.headers;

        if (!authorization) {
            throw new SafeError("authorization not found", HttpStatusCode.UNAUTHORIZED);
        }

        const authorizationParts = authorization.split(" ");

        if (authorizationParts.length !== 2) {
            throw new SafeError("authorization is not valid", HttpStatusCode.UNAUTHORIZED);
        }

        const [scheme, token] = authorizationParts;

        if (scheme !== "Basic") {
            throw new SafeError("authorization is not valid", HttpStatusCode.UNAUTHORIZED);
        }

        const tokenParts = Buffer.from(token, "base64").toString("ascii").split(":");

        if (tokenParts.length !== 2) {
            throw new SafeError("authorization token is not valid", HttpStatusCode.UNAUTHORIZED);
        }

        const [username, password] = tokenParts;

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
