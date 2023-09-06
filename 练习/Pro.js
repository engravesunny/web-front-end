function Pro (executor) {
    // Promise状态和结果
    this.PromiseState = "pending";
    this.PromiseResult = null;
    // resolve/reject缓存函数
    this.resolveCallback = [];
    this.rejectCallback = [];

    // this对象
    const that = this;

    // resolve函数
    function resolve(data) {
        setTimeout(() => {
            if(that.PromiseState === "pending") {
                that.PromiseState = "fulfilled";
                that.PromiseResult = data;
                that.resolveCallback.forEach(callback => {
                    callback(data);
                });
            }
        })
    }
   function reject(data) {
        setTimeout(() =>{
            if(that.PromiseState === "pending") {
                that.PromiseState = "rejected";
                that.PromiseResult = data;
                that.rejectCallback.forEach(callback => {
                    callback(data);
                });
            }
        })
    }
    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

Pro.prototype.then = function( onResolved, onRejected ) {
    return new Promise( (resolve, reject) => {
        try {
            if(this.PromiseState === "fulfilled") {
                let result = onResolved(this.PromiseResult);
                if(result instanceof Pro) {
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
                let result = onRejected(this.PromiseResult);
                if(result instanceof Pro) {
                    result.then( res => {
                        resolve(res);
                    }, reason => {
                        reject(reason);
                    })
                } else {
                    reject(result);
                }
            }
            if(this.PromiseState === "pending") {
                onRejected = typeof onRejected === "function" ? onRejected : () => {};
                onResolved = typeof onResolved === "function" ? onResolved : () => {};
                // 存入缓存
                this.rejectCallback.push((data) => {
                    try {
                        let result = onRejected(data);
                        if(result instanceof Pro) {
                            result.then( res => {
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
    
                this.resolveCallback.push((data) => {
                    try {
                        let result = onResolved(data);
                        if(result instanceof Pro) {
                            result.then( res => {
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
                
            }
        } catch (error) {
            reject(error);   
        }
    } )
}

Pro.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
}

Pro.all = function (promises) {
    return new Pro((resolve, reject) => {
        if(!Array.isArray(promises)) {
            reject("TypeError: args should be an array")
        }

        let result = [];
        let count = 0;

        if(promises.length === 0) {
            resolve(result);
        } else {
            for( let i in promises ) {
                promises[i].then(res => {
                    result[i] = res;
                    count++;

                    if(count === promises.length) {
                        resolve(result);
                    }
                } , reason => {
                    reject(reason);
                })
            }
        }
    })
}

Pro.allSettled = function (promises) {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(promises)) {
            reject("TypeError: promises should be an array")
        }
        
        let result = [];
        let count = 0;

        if(promises.length === 0) {
            return result;
        }

        for(let promise of promises) {
            promise.then(res => {
                result[count++] = {
                    state:'fulfilled',
                    value: res
                };
                if(count === promises.length) {
                    return resolve(result);
                }
            }, reason => {
                result[count++] = {
                    state:'rejected',
                    value: reason
                };
                if(count === promises.length) {
                    return resolve(result);
                }
            });
        }
    })
}
