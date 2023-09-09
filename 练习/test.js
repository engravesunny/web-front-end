const obj = {
    a: 1,
    b: {
        c: 2
    }
}

const newObj = Object.assign({}, obj)

obj.b.c = 10;

console.log(newObj.b.c);