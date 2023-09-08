const myNew = function (context, ...args) {
    const obj = {};
    obj.__proto__ = context.prototype;
    const result = context.apply(obj, args);
    return result instanceof Object ? result : obj;
}

const Person = function (name, age) {
    this.name = name;
    this.age = age;
}

const person = myNew(Person, '迟占斌', 18);
console.log(person.name);
