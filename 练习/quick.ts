const quick = (arr: number[]): number[] => {
  if (arr.length <= 1) return arr;
  let left: number[] = [];
  let right: number[] = [];
  const randomNum = Math.floor(Math.random() * arr.length);
  const base = arr.splice(randomNum, 1)[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= base) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quick(left).concat([base], quick(right));
};

const nums = [3, 2, 3, 6, 8, 3, 5, 1, 5, 3];

console.log(quick(nums));
