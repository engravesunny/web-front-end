function bubble(arr: number[]) {
  const len = arr.length;
  let flag = false;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        flag = true;
      }
    }
    if (!flag) break;
  }
}

let test: number[] = [9, 8, 6, 3, 5, 76, 88];

bubble(test);

console.log(test);
