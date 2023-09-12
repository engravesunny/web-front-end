const mergeSort = (arr: number[]): number[] => {
  const merge = (left: number[], right: number[]): number[] => {
    let result: number[] = [];
    let i = 0,
      j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }
    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }
    return result;
  };
  const sort = (arr: number[]): number[] => {
    if (arr.length === 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid, arr.length);
    return merge(mergeSort(left), mergeSort(right));
  };
  return sort(arr);
};

const test1: number[] = [5, 32, 2, 2, 31, 3, 4, 31, 4];

console.log(mergeSort(test1));
