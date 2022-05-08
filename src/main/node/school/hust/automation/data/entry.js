const DateTime = require("../../../../global/data/datetime");

/**
 * có những thuộc tính có thể nghiệp vụ khác không dùng
 * thì mặc kệ, không cần thiết phải tạo class mới
 */
class Entry {
    /**
     * @param {String} username
     * @param {String} password
     * @param {String} actionId
     * @param {Number[]} classIds
     * @param {DateTime} timeToStart
     * @param {DateTime} created
     */
    constructor(username, password, actionId, classIds, timeToStart, created = new DateTime()) {
        // USER MANAGE PROPERTY
        // eslint-disable-next-line no-underscore-dangle
        this._id = null; // ObjectId from MongoDB;
        this.username = username;
        this.password = password;
        this.actionId = actionId;
        this.classIds = classIds || []; // danh sách mã lớp đăng ký VD: ["1234", "5678"]
        this.timeToStart = timeToStart; // thời gian bắt đầu đơn vị milisecond
        // SERVER MANAGE PROPERTY
        this.historyId = null;
        this.created = created; // thời gian khởi tạo
        this.status = null; // trạng thái của entry
    }
}

module.exports = Entry;
