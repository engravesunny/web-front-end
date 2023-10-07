const toMemory = (fn: Function, context: any) => {
  context = context || {};
  let cache = new WeakMap();
  return function (...args: any[]) {
    if (!cache.has(args)) {
      cache.set(args, fn.apply(context, args));
    }
    return cache.get(args);
  };
};

const test2 = (num: number) => {
  let count = num;
  for (let i = 0; i < 100; i++) {
    count = count * (count + 1);
  }
  return count;
};

const testOfMemory = toMemory(test2, {});

console.time("test1");
console.log(testOfMemory(1));
console.timeEnd("test1");
console.time("test2");
console.log(testOfMemory(1));
console.timeEnd("test2");
console.time("test3");
console.log(testOfMemory(1));
console.timeEnd("test3");
