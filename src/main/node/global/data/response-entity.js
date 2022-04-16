class ResponseEntity {
    /**
     * @param {Number} code
     * @param {String} message
     * @param {*} data
     */
    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

module.exports = ResponseEntity;
