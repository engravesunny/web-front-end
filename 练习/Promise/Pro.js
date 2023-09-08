function myPromise(executor) {
    this.PromiseState = "pending";
    this.PromiseResult = null;
    this.resolveCallback = [];
    this.rejectCallback = [];

    const that = this;
    function resolve(data) {
        setTimeout(() => {
            if (that.PromiseState === "pending") {
                that.PromiseState = "fulfilled";
                that.PromiseResult = data;
                that.resolveCallback.forEach(callback => {
                    callback(data);
                })
            }
        })
    }
    function reject(data) {
        setTimeout(() => {
            if (that.PromiseState === "pending") {
                that.PromiseState = "rejected";
                that.PromiseResult = data;
                that.rejectCallback.forEach(callback => {
                    callback(data);
                })
            }
        });
    }

    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error.message);
    }
}

myPromise.prototype.then = function (onResolve, onReject) {
    onResolve = typeof onResolve === "function" ? onResolve : result => result;
    onReject = typeof onReject === "function" ? onReject : (e) => { throw new Error(e) };
    return new myPromise((resolve, reject) => {
        try {
            if (this.PromiseState === "fulfilled") {
                let result = onResolve(this.PromiseResult);
                if (result instanceof myPromise) {
                    result.then(res => {
                        resolve(res);
                    }, reason => {
                        reject(reason);
                    })
                } else {
                    resolve(result);
                }
            }
            if (this.PromiseState === "rejected") {
                let result = onReject(this.PromiseResult);
                if (result instanceof myPromise) {
                    result.then(res => {
                        resolve(res);
                    }, reason => {
                        reject(reason);
                    })
                } else {
                    reject(result);
                }
            }
            if (this.PromiseState === "pending") {
                this.resolveCallback.push((data) => {
                    try {
                        let result = onResolve(data);
                        if (result instanceof myPromise) {
                            result.then(res => {
                                resolve(res);
                            }, reason => {
                                reject(reason);
                            })
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error.message);
                    }
                })
                this.rejectCallback.push((data) => {
                    try {
                        let result = onReject(data);
                        if (result instanceof myPromise) {
                            result.them(res => {
                                resolve(res);
                            }, reason => {
                                reject(reason);
                            })
                        } else {
                            reject(result);
                        }
                    } catch (error) {
                        reject(error.message);
                    }
                })
            }
        } catch (error) {
            reject(error.message)
        }
    })
}

myPromise.prototype.catch = function (onReject) {
    return this.then(undefined, onReject);
}

myPromise.all = function (promises) {
    return new myPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new TypeError('promises must be an array');
        }
        if (promises.length === 0) {
            resolve(promise);
        }

        let count = 0;
        let result = [];
        for (let promise of promises) {
            promise.then(res => {
                result[count++] = res;
                if (count === promises.length) {
                    resolve(result);
                }
            }, reason => {
                reject(reason);
            })
        }
    })
}

myPromise.allSettled = function (promises) {
    return new myPromise((resolve) => {
        if (!Array.isArray(promises)) {
            throw new TypeError('promises must be an array');
        }
        if (promises.length === 0) {
            resolve(promise);
        }

        let count = 0;
        let result = [];
        for (let promise of promises) {
            promise.then(res => {
                result[count++] = {
                    status: "fulfilled",
                    value: res
                };
                if (count === promises.length) {
                    resolve(result);
                }
            }, reason => {
                result[count++] = {
                    status: "rejected",
                    value: reason
                };
                if (count === promises.length) {
                    resolve(result);
                }
            })
        }
    })
}







const promise1 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('1');
    }, 100)
})
const promise2 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        reject('2');
    }, 200)
})

const promise3 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('3');
    }, 300)
})

const promise4 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        reject('4');
    }, 400)
})
const promises = [promise1, promise2, promise3, promise4]

myPromise.all(promises).then(res => {
    console.log(res);
}, reason => {
    console.log(reason);
})

myPromise.allSettled(promises).then(res => {
    console.log(res);
})


