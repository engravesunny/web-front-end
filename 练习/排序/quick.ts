const quickSort = (arr: number[]): number[] => {
  if (arr.length <= 1) return arr;
  const left = [];
  const right = [];
  const randomIndex = Math.floor(Math.random() * arr.length);
  const base = arr.splice(randomIndex, 1)[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < base) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([base], quickSort(right));
};

const test3 = [49, 27, 22, 45, 2, 14, 76, 56, 89, 22, 31];

console.log(quickSort(test3));
