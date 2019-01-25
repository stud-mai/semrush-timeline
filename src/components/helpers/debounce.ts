import { setTimeout, clearTimeout } from 'timers';

const debounce = (fn: Function, ms: number) => {
    let timeout: NodeJS.Timer;
    return (...rest) => {
        const fnCall = () => fn(...rest);
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
    }
}

export default debounce;