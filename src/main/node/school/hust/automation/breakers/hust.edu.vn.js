/**
 * error on user or account of user
 */
function onAccountError(output) {
    if (output.isAccountError) return true;
    return false;
}

/**
 * error on server or school server
 */
function onServerError(output) {
    if (output.isServerError) return true;
    return false;
}

/**
 * error of user or server
 */
function onAccountOrServerError(output) {
    if (output.isAccountError || output.isServerError) return true;
    return false;
}

module.exports = {
    onServerError,
    onAccountError,
    onAccountOrServerError,
};
