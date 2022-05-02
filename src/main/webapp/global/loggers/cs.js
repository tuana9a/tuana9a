/* eslint-disable no-console */

const now = () => new Date().toLocaleString();
const stringify = (data) => JSON.stringify(data, null, 2);

export default {
    log(message) {
        console.log(`${now()} [LOG] ${stringify(message)}`);
    },
    error(error) {
        console.error(`${now()} [ERROR]`, error);
    },
    warn(message) {
        console.warn(`${now()} [WARN] ${stringify(message)}`);
    },
    info(message) {
        console.info(`${now()} [INFO] ${stringify(message)}`);
    },
    debug(message) {
        console.debug(`${now()} [DEBUG] ${stringify(message)}`);
    },
};
