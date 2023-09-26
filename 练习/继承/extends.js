// 寄生组合继承

function Parent(name) {
  this.name = name;
  this.age = 18;
  this.say = function () {
    console.log(this.name);
  }
}

Parent.prototype.play = function () {
  console.log(this.age);
}


function Child(name, age) {
  Parent.call(this, name);
  this.age = age
}
Child.prototype = Object.create(Parent.prototype);

Child.prototype.constructor = Child;

const child = new Child('大名', 20);

child.say();
child.play();


