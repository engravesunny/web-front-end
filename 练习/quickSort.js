const quick = (arrs) => {
    if (arrs.length <= 1) return arrs;
    const len = arrs.length;
    const left = [];
    const right = [];
    const index = Math.floor(Math.random() * len);
    const base = arrs.splice(index, 1)[0];
    for (let i = 0; i < len - 1; i++) {
        if (arrs[i] < base) {
            left.push(arrs[i])
        } else {
            right.push(arrs[i])
        }
    }
    return quick(left).concat([base], quick(right));
}
const test3 = [49, 27, 22, 45, 2, 14, 76, 56, 89, 22, 31];


console.log(quick(test3));