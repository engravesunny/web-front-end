function myPromise(executor) {
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    this.resolveCallbakcs = [];
    this.rejectCallbakcs = [];

    const that = this;
    function resolve(data) {
        setTimeout(() => {
            that.PromiseState = "fulfilled";
            that.PromiseResult = data;
            that.resolveCallbakcs.forEach(callback => {
                callback(data);
            })
        })
    }
    function reject(data) {
        setTimeout(() => {
            that.PromiseState = "rejected";
            that.PromiseResult = data;
            that.rejectCallbakcs.forEach(callback => {
                callback(data);
            })
        })
    }

    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

myPromise.prototype.then = function (onResolved, onRejected) {
    onRejected = typeof onRejected === "function" ? onRejected : () => { };
    onResolved = typeof onResolved === "function" ? onResolved : () => { };
    return new Promise((resolve, reject) => {
        try {
            if (this.PromiseState === "fulfilled") {
                let result = onResolved(this.PromiseResult);
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
                let result = onRejected(this.PromiseResult);
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
                this.resolveCallbakcs.push((data) => {
                    try {
                        let result = onResolved(data);
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
                        reject(error);
                    }
                })
                this.rejectCallbakcs.push((data) => {
                    try {
                        let result = onRejected(data);
                        if (result instanceof myPromise) {
                            result.then(res => {
                                resolve(res);
                            }, reason => {
                                reject(reason);
                            })
                        } else {
                            reject(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

myPromise.allSettled = function (promises) {
    return new myPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(`TypeError: ${promises} should be an array`)
        }

        let result = [];
        let count = 0;
        if (promises.length === 0) {
            return resolve(result);
        }
        for (let promise of promises) {
            promise.then(res => {
                result[count++] = {
                    state: "fulfilled",
                    value: res
                };
                if (count === promises.length) {
                    return resolve(result);
                }
            }, reason => {
                result[count++] = {
                    state: "rejected",
                    value: reason
                }
                if (count === promises.length) {
                    return resolve(result);
                }
            })
        }
    })
}




