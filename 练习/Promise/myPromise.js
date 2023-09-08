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
            reject(`TypeError: promises must be an array, got ${promises}`)
        }

        const result = [];
        let over = false;
        let count = 0;
        if (promises.length === 0) {
            resolve(result);
        }
        for (let promise of promises) {
            if (over) {
                return;
            }
            if (promise instanceof myPromise) {
                promise.then(res => {
                    result[count++] = res;
                    if (count === promises.length) resolve(result);
                }, reason => {
                    if (!over) {
                        reject(reason);
                        over = true;
                    }
                })
            } else {
                result[count++] = promise;
                if (count === promise.length) {
                    resolve(result);
                }
            }
        }
    })
}

myPromise.allSettled = function (promises) {
    return new myPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            reject(`TypeError: expect an array, got ${promises}`)
        }
        const result = [];
        let count = 0;
        if (promises.length === 0) {
            resolve(result);
        }
        for (let promise of promises) {
            promise.then(res => {
                result[count++] = {
                    state: "fulfilled",
                    value: res
                };
                if (count === promises.length) {
                    resolve(result)
                }
            }, reason => {
                result[count++] = {
                    state: "rejected",
                    value: reason
                };
                if (count === promises.length) {
                    resolve(result)
                }
            })
        }
    })
}