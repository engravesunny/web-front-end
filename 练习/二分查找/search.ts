const search = (arr: any[], target: any) => {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Array must be an array, but got ${arr}`);
  }
  if (arr.length === 0) return -1;
  let left = 0;
  let right = arr.length - 1;
  let len = arr.length;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
};

const testArr = [1, 2, 3, 4, 5, 5.5, 6, 7, 8];

const i = search(testArr, 8);
console.log(i);
