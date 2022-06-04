class HttpStatusCode {
    static BAD_REQUEST = 400;

    static UNAUTHORIZED = 401;

    static FORBIDDEN = 403;

    static NOT_FOUND = 404;

    static METHOD_NOT_ALLOWED = 405;

    static CONFLICT = 409;

    static TOO_MANY_REQUESTS = 429;

    static INTERNAL_SERVER_ERROR = 500;
}

module.exports = HttpStatusCode;
