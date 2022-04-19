module.exports = {
    loopInfinity(fn, delay) {
        const callIt = () => {
            fn();
            setTimeout(callIt, delay);
        };
        callIt();
    },
};
