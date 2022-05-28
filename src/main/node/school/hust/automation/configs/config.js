/* eslint-disable radix */
/* eslint-disable max-len */

const cttSisHustEduVn = require("../jobs/ctt-sis.hust.edu.vn");
const dkSisHustEduVn = require("../jobs/dk-sis.hust.edu.vn");

const GET_STUDENT_PROGRAM_ID = "getStudentProgram";
const GET_STUDENT_TIMETABLE_ID = "getStudentTimetable";
const AUTO_REGISTER_CLASSES_ID = "autoRegisterClasses";

const allowedActions = new Set([
    GET_STUDENT_PROGRAM_ID,
    GET_STUDENT_TIMETABLE_ID,
    AUTO_REGISTER_CLASSES_ID,
]);

const jobMapper = new Map();
jobMapper.set(GET_STUDENT_TIMETABLE_ID, cttSisHustEduVn.getStudentTimetable);
jobMapper.set(GET_STUDENT_PROGRAM_ID, cttSisHustEduVn.getStudentProgram);
jobMapper.set(AUTO_REGISTER_CLASSES_ID, dkSisHustEduVn.autoRegisterClasses);

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
AUTOMATION_CONFIG.jobMappers = jobMapper;

module.exports = AUTOMATION_CONFIG;
