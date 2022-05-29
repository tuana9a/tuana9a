const GET_STUDENT_PROGRAM_ID = "getStudentProgram";
const GET_STUDENT_TIMETABLE_ID = "getStudentTimetable";
const AUTO_REGISTER_CLASSES_ID = "autoRegisterClasses";

class AutomationConfig {
    loadFromEnv(env) {
        this.actionIds = {
            getStudentProgram: GET_STUDENT_PROGRAM_ID,
            getStudentTimetable: GET_STUDENT_TIMETABLE_ID,
            autoRegisterClasses: AUTO_REGISTER_CLASSES_ID,
        };
        this.allowedActions = new Set([
            GET_STUDENT_PROGRAM_ID,
            GET_STUDENT_TIMETABLE_ID,
            AUTO_REGISTER_CLASSES_ID,
        ]);
        this.repeatProcessAfter = parseInt(env.REPEAT_PROCESS_ENTRY_AFFER) || 15000; // default 15s repeat process
        this.maxTryCount = parseInt(env.MAX_TRY_COUNT) || 10;
        this.maxTryCaptchaCount = parseInt(env.MAX_TRY_CAPTCHA_COUNT) || 10;
        this.jobMappers = new Map();
        this.jobMappers.set(GET_STUDENT_TIMETABLE_ID, "./school/hust/automation/jobs/getStudentTimetable");
        this.jobMappers.set(GET_STUDENT_PROGRAM_ID, "./school/hust/automation/jobs/getStudentProgram");
        this.jobMappers.set(AUTO_REGISTER_CLASSES_ID, "./school/hust/automation/jobs/autoRegisterClasses");
    }
}

module.exports = AutomationConfig;
