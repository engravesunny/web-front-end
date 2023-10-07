const deepClone = function(obj) {
    const cache = new WeakMap();
    function _deepClone(value) {
        if(value == null || typeof value !== 'object') return value;
        if(value instanceof Date) return new Date(value);
        if(value instanceof RegExp) return new RegExp(value);
        if(cache.has(value)) return cache.get(value);

        let cloneValue = new value.constructor();
        cache.set(value, cloneValue);

        for(let key in value) {
            if(value.hasOwnProperty(key)) {
                cloneValue[key] = _deepClone(value[key]);
            }
        }
        return cloneValue;
    }
    return _deepClone(obj);
}

const obj = {
    name: "kecat",
    age: 18,
    hobby: ["Genshin Impact", "Honkai Impact"],
    friend: {
        name: "kemaomao",
        age: 19
    },
    fn() {
        return this.name;
    }
}

obj.hobby.push(obj);
obj.sub = obj;

const cloneObj = deepClone(obj);
cloneObj.name = "clone"
cloneObj.age = 20
cloneObj.friend.name = "clone"

console.log(obj);
console.log(cloneObj);
console.log(cloneObj !== obj);
console.log(cloneObj.sub !== obj.sub);
console.log(cloneObj.sub === cloneObj);
console.log(cloneObj.hobby[2] === cloneObj);
console.log(cloneObj.hobby[2] !== obj);



