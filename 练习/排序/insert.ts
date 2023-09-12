const insert = (arr: number[]) => {
  const len = arr.length;
  let cur: number, pre: number;
  for (let i = 1; i < len; i++) {
    cur = arr[i];
    pre = i - 1;
    while (pre >= 0 && arr[pre] > cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
};

let arr: number[] = [76, 9, 8, 6, 3, 5, 88];
let ssd: number[] = [76, 9, 8, 6, 3, 5, 88];

insert(arr);

console.log(arr);
