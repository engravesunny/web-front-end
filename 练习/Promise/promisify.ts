const promisify = (fn: Function) => {
  return function (...args: any[]) {
    return new Promise((resovle: Function, reject: Function) => {
      fn(...args, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resovle(result);
        }
      });
    });
  };
};
