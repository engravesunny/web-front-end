var myPromise = /** @class */ (function () {
    // 初始化
    function myPromise(executor) {
        this.PromiseState = "pending";
        this.PromiseResult = null;
        this.rejectCallback = [];
        this.resolveCallback = [];
        // resolve,reject函数
        var that = this;
        function resolve(data) {
            setTimeout(function () {
                if (that.PromiseState === "pending") {
                    that.PromiseState = "fulfilled";
                    that.PromiseResult = data;
                    that.resolveCallback.forEach(function (callback) { return callback(data); });
                }
            });
        }
        function reject(data) {
            setTimeout(function () {
                if (that.PromiseState === "pending") {
                    that.PromiseState = "rejected";
                    that.PromiseResult = data;
                    that.rejectCallback.forEach(function (callback) { return callback(data); });
                }
            });
        }
        try {
            executor(resolve, reject);
        }
        catch (error) {
            reject(error.message);
        }
    }
    myPromise.prototype.then = function (onResolve, onRject) {
        var _this = this;
        onResolve =
            onResolve && typeof onResolve === "function"
                ? onResolve
                : function (result) { return result; };
        onRject =
            onRject && typeof onRject === "function"
                ? onRject
                : function (e) {
                    throw new Error(e);
                };
        return new myPromise(function (resolve, reject) {
            try {
                if (_this.PromiseState === "fulfilled") {
                    var result = onResolve(_this.PromiseResult);
                    if (result instanceof myPromise) {
                        result.then(function (res) {
                            resolve(res);
                        }, function (reason) {
                            reject(reason);
                        });
                    }
                    else {
                        resolve(result);
                    }
                }
                if (_this.PromiseState === "rejected") {
                    var result = onRject(_this.PromiseResult);
                    if (result instanceof myPromise) {
                        result.then(function (res) {
                            resolve(res);
                        }, function (reason) {
                            reject(reason);
                        });
                    }
                    else {
                        reject(result);
                    }
                }
                if (_this.PromiseState === "pending") {
                    _this.resolveCallback.push(function (data) {
                        try {
                            var result = onResolve(data);
                            if (result instanceof myPromise) {
                                result.then(function (res) {
                                    resolve(res);
                                }, function (reason) {
                                    reject(reason);
                                });
                            }
                            else {
                                resolve(result);
                            }
                        }
                        catch (error) {
                            reject(error.message);
                        }
                    });
                    _this.rejectCallback.push(function (data) {
                        try {
                            var result = onRject(data);
                            if (result instanceof myPromise) {
                                result.then(function (res) {
                                    resolve(res);
                                }, function (reason) {
                                    reject(reason);
                                });
                            }
                            else {
                                reject(result);
                            }
                        }
                        catch (error) {
                            reject(error.message);
                        }
                    });
                }
            }
            catch (error) {
                reject(error.message);
            }
        });
    };
    myPromise.prototype.catch = function (onReject) {
        return this.then(undefined, onReject);
    };
    myPromise.all = function (promises) {
        if (!Array.isArray(promises)) {
            throw new Error("Array is must be a Array");
        }
        return new myPromise(function (resolve, reject) {
            var result = [];
            var count = 0;
            if (promises.length === 0) {
                resolve(result);
            }
            for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
                var promise = promises_1[_i];
                if (promise instanceof myPromise) {
                    promise.then(function (res) {
                        result[count++] = res;
                        if (count === promises.length) {
                            resolve(result);
                        }
                    }, function (reason) {
                        reject(reason);
                    });
                }
            }
        });
    };
    myPromise.allSettled = function (promises) {
        if (!Array.isArray(promises)) {
            throw new Error("promises must be a");
        }
        return new myPromise(function (resolve, rejct) {
            var result = [];
            var count = 0;
            if (promises.length === 0) {
                resolve(result);
            }
            for (var _i = 0, promises_2 = promises; _i < promises_2.length; _i++) {
                var promise = promises_2[_i];
                if (promise instanceof myPromise) {
                    promise.then(function (res) {
                        result[count++] = {
                            status: "fulfilled",
                            value: res,
                        };
                        if (count === promises.length) {
                            resolve(result);
                        }
                    }, function (reason) {
                        result[count++] = {
                            status: "rejected",
                            value: reason,
                        };
                        if (count === promises.length) {
                            resolve(result);
                        }
                    });
                }
                else {
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
    };
    myPromise.race = function (promises) {
        if (!Array.isArray(promises)) {
            throw new Error("Promises must be an array");
        }
        return new myPromise(function (resolve, reject) {
            if (promises.length === 0) {
                resolve([]);
            }
            promises.forEach(function (promise) {
                if (promise instanceof myPromise) {
                    promise.then(function (res) {
                        resolve(res);
                    }, function (reason) {
                        resolve(reason);
                    });
                }
                else {
                    resolve(promise);
                }
            });
        });
    };
    return myPromise;
}());
