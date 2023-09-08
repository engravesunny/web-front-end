Function.prototype._call = function (context, ...args) {
    const fn = this;
    context = context == null ? window : Object(context);
    const _fn = Symbol();
    context[_fn] = fn;
    const result = context[_fn](...args);
    delete context[_fn];
    return result;
}

const a = [1, 2, 34, 4, 5, 6]

Array.prototype.forEach._call(a, item => {
    console.log(item);
});

