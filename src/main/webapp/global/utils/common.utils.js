import { document } from "./dom.utils";

export default {
    getCookie(name) {
        const pattern = `${name}=`;
        const cookies = document().getElement().cookie.split(";");
        for (let i = 0, { length } = cookies; i < length; i += 1) {
            let cookie = cookies[i];
            cookie = cookie.trim();
            if (cookie.indexOf(pattern) === 0) {
                return cookie.substring(pattern.length, cookie.length);
            }
        }
        return "";
    },
    fromAnyToNumber(input = {}) {
        // eslint-disable-next-line radix
        const value = parseInt(input);
        return value || 0;
    },
};
