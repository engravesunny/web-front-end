//debounce

function debounce(fn:Function, delay:number) {
  let timer:any = null;
  return function(...args:any[]) {
    clearTimeout(timer);
    timer = null;
    timer = setTimeout(() => {
        fn.apply(null, args);
        clearTimeout(timer);
        timer = null;
    }, delay);
  }
}


// throttle

function throttle(fn:Function, delay:number) {
  let timer:any = null;
  return function(...args:any[]) {
    if(timer) return;
    timer = setTimeout(() => {
        fn.apply(null, args);
        clearTimeout(timer);
        timer = null;
    }, delay);
  }
}


let count = 0;
const fn1 = () => {
  console.log(count);
};
const fnThrottle = throttle(fn1, 1000);

let timer = setInterval(() => {
  if (count > 20) clearInterval(timer);
  count++;
  fnThrottle();
  // fn();
}, 100);
