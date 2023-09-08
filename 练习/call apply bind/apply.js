Function.prototype._apply = function (context, args) {
    const fn = this;
    context = context == null ? window : Object(context);
    const _fn = Symbol();
    context[_fn] = fn;
    const result = context[_fn](...args);
    delete context[_fn];
    return result;
}

const a = [1, 2, 3, 4, 5, 5, 6, 6, 7, 7];
const res = Array.prototype.map._apply(a, [item => {
    console.log(item);
    return item * 2;
}])
console.log(res);
