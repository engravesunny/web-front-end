const myinstanceOf = function (left, right) {
    let proto = left.__proto__;
    let prototype = right.prototype;
    while (true) {
        if (proto === null) {
            return false;
        }
        if (proto === prototype) {
            return true;
        }
        prototype = prototype.__proto__;
    }
}
// test

const date = new Date();
console.log(myinstanceOf(date, Date));
