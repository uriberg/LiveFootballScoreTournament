
export const setIntervalAndExecute = (fn: (...args: any) => any , time: number) => {
    fn();
    return setInterval(fn, time);
};
