const Person = function() {
    this.name = 'John';
    this.age = 13;
}

const person = new Person();

console.log(person);

console.log(Object.prototype === Person.prototype.__proto__);
