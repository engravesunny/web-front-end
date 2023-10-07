function Parent(name) {
  this.name = name;
  this.age = 18;
  this.say = () => {
    console.log(this.name);
  }
}

Parent.prototype.play = function() {
  console.log('play');
}

function Child(name, age) {
  this.age = age;
  Parent.call(this, name);
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child;

const child = new Child("小明", 20)

child.say();
child.play();
