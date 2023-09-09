# 手写Promise

## 构造函数

```js
const Promise = function (executor) {
    this.PromiseState = "pending"; // 声明并初始化Promise状态
    this.PromiseResult = null;     // 声明Promise结果
    this.resolveCallback = [];     // 成功的回调函数，用于resolve调用的异步情况
    this.rejectCallback = [];      // 失败的回调函数，用于rejecct调用的异步情况

    const that = this;

    function resolve(data) {
        setTimeout(() => {
            // 使用setTimeout 模拟resolve异步
            if(that.PromiseState === "pending") {  // 判断pending状态，使状态只能转变一次
                that.PromiseState = "fulfilled";
                that.PromiseResult = data;
                that.resolveCallback.forEach(callback => callback(data));
            }
        })
    }

    function reject(data) {
        setTimeout(() => {
            if(that.PromiseState === "pending") {
                that.PromiseState = "rejected";
                that.PromiseResult = data;
                that.resolveCallback.forEach(callback => callback(data));
            }
        })
    }

    try {
         executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}


```

## then函数

```js
Promise.prototype.then = function (onResolve, onReject) {
    onResolve = typeof onResolve === 'function' ? onResolve : result => result;
    onReject = typeof onReject === 'function' ? onReject : (e) => throw new Error(e);
    return new Promise((resolve, reject) => {
        try {
            if(this.PromiseState === "fulfilled") {
                const result = onResolve(result);
                if(result instanceof Promise) {
                    result.then( res => {
                        resolve(res);
                    }, reason => {
                        reject(reason);
                    })
                } else {
                    resolve(result);
                }
            }
            if(this.PromiseState === "rejected") {
                const result = onRejected(result);
                if(result instanceof Promise) {
                    result.then( res => {
                        resolve(res);
                    }, reason => {
                        reject(reason);
                    });
                } else {
                    reject(result);
                }
            }
            if(this.PromiseState === "pending") {
                this.resolveCallback.push((data) => {
                    try {
                        const result = onResolve(data);
                        if(result instanceof Promise) {
                            result.then(res => {
                                resolve(res);
                            }, reason => {
                                reject(reason);
                            })
                        } else {
                            resolve(result);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
                this.rejectCallback.push((data) => {
                    try {
                        const result = onRejected(data);
                        if(result instanceof Promise) {
                            result.then(res => {
                                resolve(res);
                            }, reason => {
                                reject(reason);
                            });
                        } else {
                            reject(result);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
```

## catch函数

```js
Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
}
```

## 实现All

```js
Promise.all = function (promises) {
    if(!Array.isArray(promises)) {
        throw new TypeError('Promises must be an array');
    }
    return new Promise((resolve, reject) => {
        const result = [];
        let count = 0;
        if(promises.length === 0) {
            resolve(result);
        }
        for(let promise of promises) {
            promise.then(res => {
                result[count++] = res;
                if(count === promises.length) {
                    resolve(result);
                }
            }, reason => {
                reject(reason);
            })
        }
    })
}
```

## 实现AllSettled

```js
Promise.allSettled = function (promises) {
    if(!Array.isArray(promises)) {
        throw new TypeError('Promises must be an array');
    }
    return Promise((resolve, reject) => {
        const result = [];
        let count = 0;
        if(promises.length === 0) {
            resolve(result);
        }
        for(let promise of promises) {
            promise.then(res => {
                result[count++] = {
                    state: "fulfilled",
                    value: res
                }
                if(count === promises.length) {
                    resolve(result);
                }
            }, reason => {
                result[count++] = {
                    state: "rejected",
                    value: reason
                }
                if(count === promises.length) {
                    resolve(result);
                }
            })
        }
    })
}
```

## 实现race

```js
Promise.race = function (promises) {
    if(!Array.isArray(promises)) {
        throw new TypeError('Promises must be an array');
    }
    return Promise((resolve, reject) => {
        if(promises.length === 0) {
            resolve(promises);
        }
        for(let promise of promises) {
            promise.then(res=> {
                resolve(res);
            }, reason => {
                reject(reason);
            })
        }
    })
}
```
