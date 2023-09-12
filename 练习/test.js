setTimeout(() => {
    console.log(1);
}, 0);

new Promise((resolve) => {
    console.log(2);
    resolve();
    console.log(3);
}).then(() => {
    console.log(4);
})

const promise2 = new Promise(async (resolve) => {
    console.log(await resolve(5));
    console.log(6);
});

async function test() {
    console.log(7);
    console.log(await promise2);
    console.log(8);
}

test();
console.log(9);

// 2 3 7 9 4 5 6 8 1


