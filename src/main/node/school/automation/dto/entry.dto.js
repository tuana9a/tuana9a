const numberDTO = require("../../../global/dto/number.dto");
const stringDTO = require("../../../global/dto/string.dto");
const Entry = require("../data/entry");
const DateTime = require("../../../global/data/datetime");

module.exports = {
    /**
     * chuẩn hóa lại entry đại loại lấy hết bỏ mỗi trường _id là trường đặc biệt
     */
    fromRequestBodyToEntry(entry) {
        const output = new Entry();
        // start assign
        output.username = stringDTO.format(entry.username);
        output.password = stringDTO.format(entry.password);
        output.actionId = stringDTO.format(entry.actionId);
        output.classIds = entry.classIds;
        output.timeToStart = new DateTime(new Date(numberDTO.toInt(entry.timeToStart)));
        // server manage property
        output.created = new DateTime(new Date(numberDTO.toInt(entry.created || Date.now())));
        output.status = entry.status;
        return output;
    },
    /**
     * mapper cho chuẩn với frontend
     * @param {Entry} entry
     */
    toClient(entry) {
        // TODO: remove some field for response to frontend
        return entry;
    },
};
