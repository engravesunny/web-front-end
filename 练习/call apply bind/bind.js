Function.prototype._bind = function (context) {
    const fn = this;
    return function (...args) {
        return fn.apply(context, args);
    }
}

const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const map = Array.prototype.map._bind(a);

const res = map(item => {
    console.log(item);
    return item * 2;
})
console.log(res);