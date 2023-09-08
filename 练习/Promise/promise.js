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
