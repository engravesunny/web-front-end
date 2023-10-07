// // Object.create
// Object._create = function (proto, properties) {
//     if (typeof proto !== 'object' || proto == null) {
//         throw new TypeError(`${proto} must be a object, but get ${proto}`);
//     }
//     const Fn = function () { }
//     Fn.prototype = proto;
//     const result = new Fn();
//     if (properties !== undefined) {
//         if (properties === null || typeof properties !== 'object') {
//             throw new TypeError(`${properties} must be a object, but get ${properties}`);
//         }
//         Object.defineProperties(result, properties);
//     }
//     return result;
// }

// const a = {
//     name: 1,
//     age: 100
// }

// const properties = {
//     age: {
//         configurable: false,
//         value: 200
//     }
// }
// const b = Object._create(a, properties)

// const c = { ...b }

// console.log(c);

// instanceof

// const myInstanceof = (a, b) => {
//     let proto = Object.getPrototypeOf(a) || null;
//     const prototype = b.prototype;

//     while (true) {
//         if (proto == null) return false;
//         if (proto === prototype) return true;
//         proto = Object.getPrototypeOf(proto);
//     }
// }
// const date = new Date()

// console.log(date instanceof Date, myInstanceof(date, Date));

// const myNew = (fn, ...args) => {
//     const intance = {};
//     intance.__proto__ = fn.prototype;
//     let result = fn.apply(intance, args);
//     return result ? result : intance;
// }

// const date = myNew(Date)

// const arr = myNew(Array, 1, 2, 3, 4)

// console.log(date, arr);

// const deboune = (fn, delay) => {
//     let timer = null;
//     return function (...args) {
//         clearTimeout(timer)
//         timer = setTimeout(() => {
//             fn.apply(null, args);
//             clearTimeout(timer)
//             timer = null;
//         }, delay)

//     }
// }

// const throttle = (fn, delay) => {
//     let timer = null;
//     return function () {
//         if (timer) return;
//         timer = setTimeout(() => {
//             fn.apply(null, args);
//             clearTimeout(timer);
//             timer = null;
//         }, delay);
//     }

// }

const checkType = (data) => {
    if (Object.is(NaN, data)) return 'NaN';
    if (typeof data !== 'object') {
        return typeof data;
    } else {
        return Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
    }
}

console.log(checkType(new Date()));















