import doUpgrade from "./do-upgrade";
import OS from "./kernel/components/os.component";
import SchoolAdminComponent from "./apps/school/hust/register-preview/components/admin.component";
import TerminalComponent from "./apps/terminal/components/terminal.component";
import SchoolRegisterPreviewComponent from "./apps/school/hust/register-preview/components/register-preview.component";
import AutomationManagerComponent from "./apps/school/hust/automation/components/automation-manager.component";
import EnvExec from "./kernel/executables/env.exec";
// import runMemoryLeakTest from "./tests/memory-leak.test";

doUpgrade();

// main init function
async function main() {
    const os = new OS(document.createElement("div"));
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
    // runMemoryLeakTest(os, "terminal", terminalOpts, 100, 200);
    // runMemoryLeakTest(os, "school-admin", terminalOpts, 75, 200);
    // runMemoryLeakTest(os, "automation-form", terminalOpts, 75, 200);
    // runMemoryLeakTest(os, "register-preview", registerPreviewOpts, 20, 500);
    document.body.appendChild(os.getElement());
}
main();
