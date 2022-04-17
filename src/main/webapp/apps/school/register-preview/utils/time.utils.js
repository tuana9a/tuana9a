/* eslint-disable eqeqeq */
/* eslint-disable radix */
export default {
    /**
     * @param {String} weeksInString
     * @param {String | Number} weekToCheck
     * @returns is weeksInString container weekToCheck or not
     */
    isContainWeek(weeksInString, weekToCheck) {
        if (!weeksInString) {
            return false;
        }
        const weeksByComma = weeksInString.split(",");
        // eslint-disable-next-line no-restricted-syntax
        for (const weekByComma of weeksByComma) {
            const weeksByDash = weekByComma.split("-");
            if (weeksByDash.length == 1) {
            // single like 32,33,34,35
                if (parseInt(weekByComma) == weekToCheck) {
                    return true;
                }
            } else if (weeksByDash.length == 2) {
            // period like 32-39,42-45
                const start = parseInt(weeksByDash[0]);
                const stop = parseInt(weeksByDash[1]);
                if (weekToCheck >= start && weekToCheck <= stop) {
                    return true;
                }
            }
        // can't parse
        }
        return false;
    },
    classTimeFormat(hour = 0, minute = 0) {
        return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
    },
};
