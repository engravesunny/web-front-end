const throttle = function (fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay)
    }
}

let count = 0;
const fn = () => {
    console.log(count);
}
const fnThrottle = throttle(fn, 300);

let timer = setInterval(() => {
    if (count > 20) clearInterval(timer);
    fnThrottle();
    // fn();
    count++;
}, 100)


