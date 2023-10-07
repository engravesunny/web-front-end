const deepClone1 = (obj: any): any => {
  let cache = new WeakMap();
  const _deepClone = (value: any): any => {
    if (value == null || typeof value !== "object") return value;
    if (value instanceof Date) return new Date(value);
    if (value instanceof RegExp) return new RegExp(value);
    if (cache.has(value)) return cache.get(value);
    let cloneObj = new value.constructor();
    cache.set(value, cloneObj);
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        cloneObj[key] = _deepClone(value[key]);
      }
    }
    return cloneObj;
  };
  return _deepClone(obj);
};

const obj1 = {
  name: "kecat",
  age: 18,
  hobby: ["Genshin Impact", "Honkai Impact", {}],
  friend: {
    name: "kemaomao",
    age: 19,
  },
  fn() {
    return this.name;
  },
  sub: {},
};

obj1.hobby.push(obj1);
obj1.sub = obj1;

const cloneObj1 = deepClone1(obj1);
console.log(
  "%c [ cloneObj1 ]-38",
  "font-size:13px; background:pink; color:#bf2c9f;",
  cloneObj1
);

cloneObj1.name = "clone";
cloneObj1.age = 20;
cloneObj1.friend.name = "clone";

console.log(obj1);
console.log(cloneObj1);
console.log(cloneObj1 !== obj1);
console.log(cloneObj1.sub !== obj1.sub);
console.log(cloneObj1.sub === cloneObj1);
console.log(cloneObj1.hobby[3] === cloneObj1);
console.log(cloneObj1.hobby[3] !== obj1);
