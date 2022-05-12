import runMemoryLeakTest from "./run-memory-leak.test";

export default function memoryLeakTest(os, name, times = 40, delay = 500) {
    runMemoryLeakTest(os, name, {}, times, delay);
}
