import doUpgrade from "./do-upgrade";
import OS from "./kernel/components/os.component";
import SchoolAdminComponent from "./apps/school/hust/register-preview/components/admin.component";
import TerminalComponent from "./apps/terminal/components/terminal.component";
import SchoolRegisterPreviewComponent from "./apps/school/hust/register-preview/components/register-preview.component";
import AutomationManagerComponent from "./apps/school/hust/automation/components/automation-manager.component";
import EnvExec from "./kernel/executables/env.exec";
import { body, dce } from "./global/utils/dom.utils";
import PasswordGeneratorComponent from "./apps/password-generator/components/password-generator.component";
// import memoryLeakTest from "./tests/memory-leak.test";

doUpgrade();

const os = new OS(dce("div"));

os.addBin("env", EnvExec);

os.install("terminal", TerminalComponent, {
    dropFile: true,
    width: 500,
    height: 400,
    x: 0,
    y: 0,
});

os.install("register-preview", SchoolRegisterPreviewComponent, {
    // bỏ đi các mốc thời gian sẽ không có thời khóa biểu
    // dropHours: new Set([0, 1, 2, 3, 4, 21, 22, 23]),
    dropHours: new Set([]),
    rowHeight: 29,
    maxSchoolClass: 10,
    width: 1000,
    height: 500,
    x: 0,
    y: 0,
});

os.install("school-admin", SchoolAdminComponent, {
    width: 600,
});

os.install("automation-manager", AutomationManagerComponent, {
    width: 700,
});

os.install("password-generator", PasswordGeneratorComponent, {
    width: 500,
    height: 400,
});

body().appendChild(os);

// memoryLeakTest(os, "terminal");
// memoryLeakTest(os, "register-preview");
// memoryLeakTest(os, "automation-manager");
