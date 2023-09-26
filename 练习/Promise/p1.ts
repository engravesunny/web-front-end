class myPromise {
  PromiseState: string;
  PromiseResult: any;
  resolveCallback: Function[];
  rejectCallback: Function[];

  // 初始化
  constructor(executor: Function) {
    this.PromiseState = "pending";
    this.PromiseResult = null;
    this.rejectCallback = [];
    this.resolveCallback = [];
    // resolve,reject函数
    const that = this;
    function resolve(data: any) {
      setTimeout(() => {
        if (that.PromiseState === "pending") {
          that.PromiseState = "fulfilled";
          that.PromiseResult = data;
          that.resolveCallback.forEach((callback) => callback(data));
        }
      });
    }
    function reject(data: any) {
      setTimeout(() => {
        if (that.PromiseState === "pending") {
          that.PromiseState = "rejected";
          that.PromiseResult = data;
          that.rejectCallback.forEach((callback) => callback(data));
        }
      });
    }
    try {
      executor(resolve, reject);
    } catch (error: any) {
      reject(error.message);
    }
  }

  then(onResolve?: Function, onRject?: Function) {
    onResolve =
      onResolve && typeof onResolve === "function"
        ? onResolve
        : (result: any) => result;
    onRject =
      onRject && typeof onRject === "function"
        ? onRject
        : (e: any) => {
            throw new Error(e);
          };
    return new myPromise((resolve: Function, reject: Function) => {
      try {
        if (this.PromiseState === "fulfilled") {
          let result = (onResolve as Function)(this.PromiseResult);
          if (result instanceof myPromise) {
            result.then(
              (res: any) => {
                resolve(res);
              },
              (reason: any) => {
                reject(reason);
              }
            );
          } else {
            resolve(result);
          }
        }
        if (this.PromiseState === "rejected") {
          let result = (onRject as Function)(this.PromiseResult);
          if (result instanceof myPromise) {
            result.then(
              (res: any) => {
                resolve(res);
              },
              (reason: any) => {
                reject(reason);
              }
            );
          } else {
            reject(result);
          }
        }
        if (this.PromiseState === "pending") {
          this.resolveCallback.push((data: any) => {
            try {
              let result = (onResolve as Function)(data);
              if (result instanceof myPromise) {
                result.then(
                  (res: any) => {
                    resolve(res);
                  },
                  (reason: any) => {
                    reject(reason);
                  }
                );
              } else {
                resolve(result);
              }
            } catch (error: any) {
              reject(error.message);
            }
          });
          this.rejectCallback.push((data: any) => {
            try {
              let result = (onRject as Function)(data);
              if (result instanceof myPromise) {
                result.then(
                  (res: any) => {
                    resolve(res);
                  },
                  (reason: any) => {
                    reject(reason);
                  }
                );
              } else {
                reject(result);
              }
            } catch (error: any) {
              reject(error.message);
            }
          });
        }
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  catch(onReject: Function) {
    return this.then(undefined, onReject);
  }
  static all(promises: myPromise[]) {
    if (!Array.isArray(promises)) {
      throw new Error("Array is must be a Array");
    }
    return new myPromise((resolve: Function, reject: Function) => {
      const result: any[] = [];
      let count = 0;
      if (promises.length === 0) {
        resolve(result);
      }
      for (let promise of promises) {
        if (promise instanceof myPromise) {
          promise.then(
            (res: any) => {
              result[count++] = res;
              if (count === promises.length) {
                resolve(result);
              }
            },
            (reason: any) => {
              reject(reason);
            }
          );
        }
      }
    });
  }
  static allSettled(promises: myPromise[]) {
    if (!Array.isArray(promises)) {
      throw new Error("promises must be a");
    }
    return new myPromise((resolve: Function, rejct: Function) => {
      const result: any[] = [];
      let count = 0;
      if (promises.length === 0) {
        resolve(result);
      }
      for (let promise of promises) {
        if (promise instanceof myPromise) {
          promise.then(
            (res: any) => {
              result[count++] = {
                status: "fulfilled",
                value: res,
              };
              if (count === promises.length) {
                resolve(result);
              }
            },
            (reason: any) => {
              result[count++] = {
                status: "rejected",
                value: reason,
              };
              if (count === promises.length) {
                resolve(result);
              }
            }
          );
        } else {
          result[count++] = {
            status: "fulfilled",
            value: promise,
          };
          if (count === promises.length) {
            resolve(result);
          }
        }
      }
    });
  }
  static race(promises: Array<myPromise>) {
    if (!Array.isArray(promises)) {
      throw new Error("Promises must be an array");
    }
    return new myPromise((resolve: Function, reject: Function) => {
      if (promises.length === 0) {
        resolve([]);
      }
      promises.forEach((promise) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res: any) => {
              resolve(res);
            },
            (reason: any) => {
              resolve(reason);
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
}
