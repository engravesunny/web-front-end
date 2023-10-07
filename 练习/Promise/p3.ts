const PENDING = "pending"
const RESOLVED = "fulfilled"
const REJECTED = "rejected"

class P3{
    PromiseStatus:string;
    PromiseResult:any;
    resolveCallbacks:Function[];
    rejectCallbacks:Function[];
    constructor(executor:Function){
        this.PromiseResult = null;
        this.PromiseStatus = PENDING;
        this.resolveCallbacks = [];
        this.rejectCallbacks = [];
        let that = this;

        function resolve(data:any) {
            if(that.PromiseStatus === PENDING) {
                setTimeout(() => {
                    that.PromiseResult = data;
                    that.PromiseStatus = RESOLVED;
                    that.resolveCallbacks.forEach(cb => cb(data));
                });
            }
        }
        function reject(data:any) {
            if(that.PromiseStatus === PENDING) {
                setTimeout(() => {
                    that.PromiseResult = data;
                    that.PromiseStatus = REJECTED;
                    that.rejectCallbacks.forEach(cb => cb());   
                });
            }
        }
        try {
            executor(resolve, reject);
        } catch (error:any) { 
            reject(error.message)
        }
    }
    then(onResolved?:Function, onRejected?:Function) {
        onResolved = typeof onResolved === 'function' ? onResolved : (result:any) => result;
        onRejected = typeof onRejected === 'function' ? onRejected : (error:any) => {throw new Error(error);};
        return new P3((resolve:Function, reject:Function) => {
            try {
                if(this.PromiseStatus === RESOLVED) {
                    const result = onResolved(this.PromiseResult);
                    if(result instanceof P3) {
                        result.then((res:any ) => {
                            resolve(res);
                        }, (reason:any) => {
                            reject(reason);
                        })
                    } else {
                        resolve(result);
                    }
                } 
                if(this.PromiseStatus === REJECTED) {
                    const result = onRejected(this.PromiseResult);
                    if(result instanceof P3) {
                        result.then((res:any) => {
                            resolve(res)
                        }, (reason:any)=> {
                            reject(reason);
                        })
                    } else {
                        reject(result);
                    }
                }
                if(this.PromiseStatus === PENDING) {
                    this.resolveCallbacks.push((data:any) => {
                        try {
                            const result = onResolved(data);
                            if(result instanceof P3) {
                                result.then((res:any) => {
                                    resolve(res)
                                }, (reason:any) => {
                                    reject(reason)
                                })
                            } else {
                                resolve(result);
                            }
                        } catch (error:any) {
                            reject(error.message);
                        }
                    })
                    this.rejectCallbacks.push((data:any) => {
                        try {
                            const result = onRejected(data);
                            if(result instanceof P3) {
                                result.then((res:any) => {
                                    resolve(res);
                                } , (reason:any) => {
                                    reject(reason);
                                })
                            }
                        } catch (error:any) {
                            reject(error.message)
                        }
                    })
                }
            } catch (error:any) {
                reject(error.message)
            }
        })
    }
    catch(onRejected?:Function) {
        return this.then(undefined, onRejected)
    }
    static all(promises: any[]) {
        if(!Array.isArray(promises)) {
            throw new TypeError('promises must be an array, but got' + JSON.stringify(promises));
        }
        return new P3((resolve:Function, reject:Function)=> {
            const result:any[] = [];
            let count = 0;
            if(promises.length === 0) {
                resolve(result)  
            }
            for(let promise of promises) {
                if(promise instanceof P3) {
                    promise.then((res:any) => {
                        result[count++] = res;
                        if(count === promises.length) {
                            resolve(result);
                        }
                    }, (reason:any) => {
                        reject(reason);
                    })
                } else {
                    result[count++] = promise;
                    if(count === promises.length) {
                        resolve(result);
                    }
                }
            }
        })
    }
    static allSettled(promises:any[]) {
        if(!Array.isArray(promises)) {
            throw new TypeError('promises must be an array, but got' + JSON.stringify(promises));
        }
        return new P3((resolve:Function, reject:Function)=> {
            const result:any[] = [];
            let count = 0;
            if(promises.length === 0) {
                resolve(result)  
            }
            for(let promise of promises) {
                if(promise instanceof P3) {
                    promise.then((res:any) => {
                        result[count++] = {
                            value:res,
                            status:RESOLVED
                        };
                        if(count === promises.length) {
                            resolve(result);
                        }
                    }, (reason:any) => {
                        result[count++] = {
                            value:reason,
                            status: REJECTED
                        }
                        if(count === promises.length) {
                            resolve(result);
                        } 
                    })
                } else {
                    result[count++] = {
                        value:promise,
                        status: RESOLVED
                    };
                    if(count === promises.length) {
                        resolve(result);
                    }
                }
            }
        })
    }
    static race(promises:any[]) {
        if(!Array.isArray(promises)) {
            throw new TypeError('promises must be an array, but got' + JSON.stringify(promises));
        }
        return new P3((resolve:Function, reject:Function) => {
            if(promises.length === 0) {
                resolve([]);
            }
            for(let promise of promises) {
                if(promise instanceof P3) {
                    promise.then((res:any) => {
                        resolve(res);
                    }, (reason:any) => {
                        reject(reason);
                    })
                } else {
                    resolve(promise);
                }
            }
        }) 
    }
    static resolve(data:any) {
        return new P3((resolve:Function, reject:Function) => {
            resolve(data);
        })
    }
    static reject(data:any) {
        return new P3((resolve:Function, reject:Function) => {
            reject(data)
        })
    }
}