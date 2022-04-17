/* eslint-disable no-unused-vars */
import OS from "../kernel/components/os.component";
import LaunchOption from "../kernel/data/launch.option";

async function loopAsync(fun, times, delay = 0) {
    let i = 0;
    function loop() {
        fun();
        i += 1;
        if (i > times) {
            return;
        }
        setTimeout(loop, delay);
    }
    loop();
}

/**
 * @param {OS} os
 * @param {String} name
 * @param {LaunchOption} launchOption
 */
async function runMemoryLeakTest(os, name, launchOption, times = 10, delay = 500) {
    setTimeout(() => {
        loopAsync(
            () => {
                const pid = os.launch(name, launchOption);
                setTimeout(() => os.kill(pid), delay);
            },
            times,
            delay,
        );
    }, 5_000);
}

export default runMemoryLeakTest;
