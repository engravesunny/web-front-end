const deepClone = () => {

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