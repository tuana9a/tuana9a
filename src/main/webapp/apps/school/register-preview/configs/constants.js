const CONSTANTS = {
    defaultRowHeight: 29,
    comeHomeHours: new Set([0, 1, 2, 3, 4, 5, 20, 21, 22, 23]),
    dayOfWeekInNumbers: [2, 3, 4, 5, 6, 7, 8],
    dayOfWeekSwitch: new Map(),
};

function addDayOfWeekSwitch(key, number, className, displayName) {
    CONSTANTS.dayOfWeekSwitch.set(key, { number, className, displayName });
}

addDayOfWeekSwitch(2, 2, "mon", "T2");
addDayOfWeekSwitch(3, 3, "tue", "T3");
addDayOfWeekSwitch(4, 4, "wed", "T4");
addDayOfWeekSwitch(5, 5, "thu", "T5");
addDayOfWeekSwitch(6, 6, "fri", "T6");
addDayOfWeekSwitch(7, 7, "sat", "T7");
addDayOfWeekSwitch(8, 8, "sun", "CN");

export default CONSTANTS;
