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

