function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
            clearTimeout(timer);
        }, delay)
    }
}

const fn = () => {
    console.log(234);
    console.timeEnd('debounce');

}

const fnDebounce = debounce(fn, 300);

let count = 0;

console.time('debounce');
const timer = setInterval(() => {
    if (count > 10) {
        clearInterval(timer);
    }
    count = count + 1;
    fnDebounce();
}, 100)

const debunce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(null, args);
            clearTimeout(timer)
        }, delay);
    }
}

const throllte = (fn, delay) => {
    let timer = null;
    return function (...args) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(null, args)
            clearInterval(timer)
            timer = null;
        }, delay)
    }
}
