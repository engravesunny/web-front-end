const deepClone = (obj: any) => {
  const cache = new WeakMap();
  const _deepClone = (value: any) => {
    if (typeof value !== "object" || value == null) return value;
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

const obj = {
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

obj.hobby.push(obj);
obj.sub = obj;

const cloneObj = deepClone(obj);
console.log(
  "%c [ cloneObj ]-38",
  "font-size:13px; background:pink; color:#bf2c9f;",
  cloneObj
);

cloneObj.name = "clone";
cloneObj.age = 20;
cloneObj.friend.name = "clone";

console.log(obj);
console.log(cloneObj);
console.log(cloneObj !== obj);
console.log(cloneObj.sub !== obj.sub);
console.log(cloneObj.sub === cloneObj);
console.log(cloneObj.hobby[3] === cloneObj);
console.log(cloneObj.hobby[3] !== obj);
