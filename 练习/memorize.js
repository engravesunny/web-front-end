// 函数缓存
const memorize = (func, context) => {
    context = context || this;
    let cache = Object.create(null);
    return (...args) => {
        if(!cache[args]){
            cache[args] = func.apply(context, args);
        }
        return cache[args];
    }
}
const add = (a, b) => {
    console.log(1);
    return a + b;
}
const calc = memorize(add)

console.log(calc(1,2));
console.log(calc(1,2));
