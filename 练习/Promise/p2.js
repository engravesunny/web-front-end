var PENDING = "pending";
var RESOLVED = "fulfilled";
var REJECTED = "rjected";
var P2 = /** @class */ (function () {
    function P2(executor) {
        this.PromiseStatus = PENDING;
        this.PromiseResult = null;
        this.rejectCallbacks = [];
        this.resolveCallbacks = [];
        var self = this;
        function resolve(data) {
            setTimeout(function () {
                if (self.PromiseStatus === PENDING) {
                    self.PromiseStatus = RESOLVED;
                    self.PromiseResult = data;
                    self.resolveCallbacks.forEach(function (callback) { return callback(data); });
                }
            });
        }
        function reject(data) {
            setTimeout(function () {
                if (self.PromiseStatus === PENDING) {
                    self.PromiseResult = data;
                    self.PromiseStatus = REJECTED;
                    self.rejectCallbacks.forEach(function (callback) { return callback(data); });
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
    P2.prototype.then = function (onResolved, onRejected) {
        var _this = this;
        onResolved =
            onResolved && typeof onResolved === "function"
                ? onResolved
                : function (result) { return result; };
        onRejected =
            onRejected && typeof onRejected === "function"
                ? onRejected
                : function (e) {
                    throw new Error(e);
                };
        return new P2(function (resolve, reject) {
            try {
                if (_this.PromiseStatus === RESOLVED) {
                    var result = onResolved(_this.PromiseResult);
                    if (result instanceof P2) {
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
                if (_this.PromiseStatus === REJECTED) {
                    var result = onRejected(_this.PromiseResult);
                    if (result instanceof P2) {
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
                if (_this.PromiseStatus === PENDING) {
                    _this.resolveCallbacks.push(function (data) {
                        try {
                            var result = onResolved(data);
                            if (result instanceof P2) {
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
                    _this.rejectCallbacks.push(function (data) {
                        try {
                            var result = onResolved(data);
                            if (result instanceof P2) {
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
    return P2;
}());
