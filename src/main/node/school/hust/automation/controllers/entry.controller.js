const mongodb = require("mongodb");

const HistoryRecord = require("../data/history-record");
const automationUtils = require("../utils/automation.utils");
const EntryStatus = require("../configs/entry-status");
// eslint-disable-next-line no-unused-vars
const Entry = require("../data/entry");
const SafeError = require("../../../../global/exceptions/safe-error");
const HttpStatusCode = require("../../../../global/configs/http-status-code");

class EntryController {
    mongodbClient;

    getEntriesCollection() {
        return this.mongodbClient.getEntriesCollection();
    }

    getHistoryCollection() {
        return this.mongodbClient.getHistoryCollection();
    }

    /**
     * thêm mới entry
     * @param {Entry} entry
     */
    async insert(entry) {
        // create new entry has history record
        const insertEntryResult = await this.getEntriesCollection().insertOne(entry);
        const insertHistoryResult = await this.getHistoryCollection()
            .insertOne(new HistoryRecord());
        // create relation between entry and history
        const entryId = insertEntryResult.insertedId;
        const historyId = insertHistoryResult.insertedId;
        this.getEntriesCollection().updateOne(
            { _id: new mongodb.ObjectId(entryId) },
            { $set: { historyId } },
        );
        this.getEntriesCollection().updateOne(
            { _id: new mongodb.ObjectId(historyId) },
            { $set: { entryId } },
        );
        return { entryId, historyId };
    }

    /**
     * NOTE: sử  dụng chung cho cả update entry và cancel entry
     * @param {String} entryId
     * @param {*} updateEntry
     */
    async update(entryId, updateEntry) {
        // check exist first
        const existEntry = await this.getEntriesCollection().findOne({
            _id: new mongodb.ObjectId(entryId),
        });
        if (!existEntry) {
            throw new SafeError("entry not found", HttpStatusCode.NOT_FOUND);
        }
        // không tin tưởng user không được sử dụng trực tiếp entry từ input
        // vì có thể người dùng này cập nhật entry của người khác nếu biết _id
        if (existEntry.username !== updateEntry.username) {
            throw new SafeError("username not match", HttpStatusCode.FORBIDDEN);
        }
        if (existEntry.password !== updateEntry.password) {
            throw new SafeError("password not match", HttpStatusCode.FORBIDDEN);
        }
        if (existEntry.status === EntryStatus.DONE) {
            throw new SafeError("entry is done", HttpStatusCode.BAD_REQUEST);
        }
        if (existEntry.status === EntryStatus.CANCELED) {
            throw new SafeError("entry is canceled", HttpStatusCode.BAD_REQUEST);
        }
        const updateDTO = {};
        if (updateEntry.actionId) {
            updateDTO.actionId = updateEntry.actionId;
        }
        if (updateEntry.newUsername) {
            updateDTO.username = updateEntry.username;
        }
        if (updateEntry.newPassword) {
            updateDTO.password = updateEntry.newPassword;
        }
        if (updateEntry.classIds) {
            updateDTO.classIds = updateEntry.classIds;
        }
        if (updateEntry.timeToStart) {
            updateDTO.timeToStart = updateEntry.timeToStart;
        }
        if ([EntryStatus.CANCELED].includes(updateEntry.status)) {
            // hiện tại chỉ cho phép cancel thôi
            updateDTO.status = updateEntry.status;
        }
        await this.getEntriesCollection().updateOne(
            { _id: new mongodb.ObjectId(entryId) },
            {
                $set: updateDTO,
            },
        );
        // thêm log vào history của bản ghi cũ
        const ignoreKey = new Set([
            // ignore property for create difference between two entry
            "_id",
            "created",
            "historyId",
        ]);
        const historyRecord = automationUtils.injectTimestampAt({
            diff: automationUtils.createEntryDiff(existEntry, updateEntry, {
                ignoreKey,
            }),
            message: "update",
        });
        await this.getHistoryCollection().updateOne(
            { _id: new mongodb.ObjectId(existEntry.historyId) },
            {
                $push: {
                    details: historyRecord,
                },
            },
        );
    }

    async find({ username, password }) {
        const result = await this.getEntriesCollection().find({ username, password }).toArray();

        return result;
    }

    async processResult(entry, result) {
        const { historyId } = entry;
        const historyRecord = automationUtils.injectTimestampAt(result);
        await this.getHistoryCollection().updateOne(
            { _id: new mongodb.ObjectId(historyId) },
            {
                $push: {
                    details: historyRecord,
                },
            },
        );
        await this.getEntriesCollection().updateOne(
            // eslint-disable-next-line no-underscore-dangle
            { _id: new mongodb.ObjectId(entry._id) },
            { $set: { status: result.isBreak ? EntryStatus.FAILED : EntryStatus.DONE } },
        );
    }
}

module.exports = EntryController;
