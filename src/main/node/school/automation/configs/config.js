// constants
const GET_STUDENT_PROGRAM_ID = "getStudentProgram";
const GET_STUDENT_TIMETABLE_ID = "getStudentTimetable";
const AUTO_REGISTER_CLASSES_ID = "autoRegisterClasses";

// eslint-disable-next-line max-len
const allowedActions = new Set([GET_STUDENT_PROGRAM_ID, GET_STUDENT_TIMETABLE_ID, AUTO_REGISTER_CLASSES_ID]);

module.exports = {
    actionIds: {
        getStudentProgram: GET_STUDENT_PROGRAM_ID,
        getStudentTimetable: GET_STUDENT_TIMETABLE_ID,
        autoRegisterClasses: AUTO_REGISTER_CLASSES_ID,
    },
    allowedActions,
    rateLimit: {
        submitEntry: {
            windowMs: 5 * 60 * 1000,
            max: 5,
        },
    },
};
