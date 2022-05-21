/* eslint-disable radix */
/* eslint-disable max-len */

const GET_STUDENT_PROGRAM_ID = "getStudentProgram";
const GET_STUDENT_TIMETABLE_ID = "getStudentTimetable";
const AUTO_REGISTER_CLASSES_ID = "autoRegisterClasses";

const allowedActions = new Set([
    GET_STUDENT_PROGRAM_ID,
    GET_STUDENT_TIMETABLE_ID,
    AUTO_REGISTER_CLASSES_ID,
]);

const botJobIdMapper = new Map();
botJobIdMapper.set(GET_STUDENT_TIMETABLE_ID, "ctt-sis.hust.edu.vn/getStudentTimetable");
botJobIdMapper.set(GET_STUDENT_PROGRAM_ID, "ctt-sis.hust.edu.vn/getStudentProgram");
botJobIdMapper.set(AUTO_REGISTER_CLASSES_ID, "dk-sis.hust.edu.vn/autoRegisterClasses");

const AUTOMATION_CONFIG = {};

AUTOMATION_CONFIG.actionIds = {
    getStudentProgram: GET_STUDENT_PROGRAM_ID,
    getStudentTimetable: GET_STUDENT_TIMETABLE_ID,
    autoRegisterClasses: AUTO_REGISTER_CLASSES_ID,
};
AUTOMATION_CONFIG.allowedActions = allowedActions;
AUTOMATION_CONFIG.repeatProcessAfter = parseInt(process.env.REPEAT_PROCESS_ENTRY_AFFER) || 15000; // default 15s repeat process
AUTOMATION_CONFIG.maxTryCount = parseInt(process.env.MAX_TRY_COUNT) || 10;
AUTOMATION_CONFIG.maxTryCaptchaCount = parseInt(process.env.MAX_TRY_CAPTCHA_COUNT) || 10;
AUTOMATION_CONFIG.jobIdMappers = botJobIdMapper;

module.exports = AUTOMATION_CONFIG;
