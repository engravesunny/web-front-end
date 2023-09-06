// 1.instanceOf

// function myInstanceOf(obj, className) {
//     let proto = obj.__proto__;
//     let prototype = className.prototype;

//     while(true) {
//         if(proto == null) {
//             return false;
//         }
//         if(proto === prototype) {
//             return true;
//         }
//         proto = proto.__proto__;
//     }

// }

// 1.test

// const pro = new Promise( (resolve, reject) => {
//     resolve('1111')
// } )

// console.log(myInstanceOf(pro, Promise));

// 2.new

// function myNew (context, ...args) {
//     // 1.创建空对象
//     const obj = {};
//     // 2.将新创建对象的原型链接到构造函数的原型
//     obj.__proto__ = context.prototype;
//     // 3.构造函数内部的this绑定到新创建的对象， 执行构造函数
//     let result = context.apply(obj, args);
//     // 4.如果构造函数没有返回对象 返回新创建的对象
//     return result instanceof Object ? result : obj;
// }

// 2. test

// const Person = function() {
//     this.name = 'John';
//     this.age = 13;
// }

// const per1 = new Person();

// const per2 = myNew(Person);


// console.log(per1, per2);


// 3. call apply bind

// // 3.1 call

// Function.prototype._call = function(context, ...args) {
//     const fn = this;  // 获取需要执行的函数

//     context = context == null ? window : Object(context); // 将context转为对象

//     let _fn = Symbol();

//     context[_fn] = fn;

//     let result = context[_fn](...args);

//     delete context[_fn];

//     return result;

// }

// // 3.2 apply

// Function.prototype._apply = function(context, args) {
//     const fn = this; // 获取需要执行的函数

//     context = context == null ? window : Object(context); // 对象化传入的this
//     args = args || [];
//     if( !Array.isArray(args) ) {
//         throw new Error (`TypeError: Expect an array of arguments, got ` + args);
//     }

//     let _fn = Symbol();

//     context[_fn] = fn;  // 使用context调用函数

//     let result = context[_fn](...args);

//     delete context[_fn];

//     return result;
// }

// Function.prototype._bind = function(context) {
//     let fn = this;
//     return function(...args) {
//         return fn._apply(context, args);
//     }
// }

// // 3 call apply bind test

// const a = [1,2,3,4];

// Array.prototype.map._apply(a, [(item) => {
//     console.log(item);
// }])

// Array.prototype.map._call(a, (item) => {
//     console.log(item);
// })

// const obj1 = {
//     name: 'foo',
//     fn: function() {
//         console.log(this.name);
//     }
// }
// const obj2 = {
//     name:'bar',
// }

// const fn2 = obj1.fn._bind(obj2);

// fn2();

// // 4. deepClone
// const deepClone = function(obj) {
//     const cache = new WeakMap();
//     const _deepClone = function(value) {
//         if(value == null || typeof value !== "object") return value;
//         if(value instanceof Date) return new Date(value);
//         if(value instanceof RegExp) return new RegExp(value);
//         if(cache.has(value)) return cache.get(value);

//         const cloneObj = new value.constructor();
//         cache.set(value, cloneObj);

//         for(let key in value) {
//             if( value.hasOwnProperty(key) ) {
//                 cloneObj[key] = _deepClone(value[key]);
//             }
//         }
//         return cloneObj;
//     }
//     return _deepClone(obj);
// }


// // 4. deepClone test

// const obj = {
//     name:"kecat",
//     age:18,
//     hobby: [ "Genshin Impact", "Honkai Impact" ],
//     friend: {
//         name: "kemaomao",
//         age: 19
//     },
//     fn() {
//         return this.name;
//     }
// }

// obj.hobby.push(obj);
// obj.sub = obj;

// const cloneObj = deepClone(obj);
// cloneObj.name = "clone"
// cloneObj.age = 20
// cloneObj.friend.name = "clone"


// console.log(obj);
// console.log(cloneObj);
// console.log(cloneObj !== obj);
// console.log(cloneObj.sub !== obj.sub);
// console.log(cloneObj.sub === cloneObj);
// console.log(cloneObj.hobby[2] === cloneObj);
// console.log(cloneObj.hobby[2] !== obj);

// 5.手写防抖节流
// // 防抖
// function debounce(func, delay) {
//     let timer = null;
//     return function (...args) {
//         // 清除计时器
//         clearTimeout(timer);
//         // 新建一个计时器
//         timer = setTimeout(() => {
//             func.apply(this, args);
//         }, delay);
//     }
// }

// // 节流
// function throttle(func, delay) {
//     let timer = null;
//     return function (...args) {
//         if (!timer) {
//             timer = setTimeout(() => {
//                 func.apply(this, args);
//                 timer = null;
//             }, delay)
//         }
//     }
// }

// 5.test

// let timer1;
// let timer2;

// // 防抖
// const fn1 = () => {
//     console.log('防抖');
// }

// timer1 = setInterval(debounce(fn1, 200), 100);

// // 节流
// const fn2 = () => {
//     console.log('节流');
// }

// timer2 = setInterval(throttle(fn2, 200), 100);

// setTimeout(() => {
//     clearInterval(timer1);
//     clearInterval(timer2);
// }, 2000);

// // 6.手写ajax请求

// function ajax(method, url, data) {
//     return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest()
//         xhr.open(method, url);
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {
//                 if (xhr.status === 200) {
//                     resolve(JSON.stringify(xhr.responseText))
//                 }
//             } else {
//                 reject('error');
//             }
//         }
//         xhr.send(JSON.stringify(data));

//     })
// }

// // 7.数组去重

// // 7.1 set + 数组复制

// function uniquel1(array) {
//     return Array.from(new Set(array));
// }

// // 7.2 set + 扩展运算符

// function uniquel2(array) {
//     return [...new Set(array)]
// }

// // 7.3 filer, 判断是不是首次出现吗如果不是就过滤掉

// function uniquel3(array) {
//     return array.filter((item, index) => {
//         return array.indexOf(item) === index;
//     })
// }

// // 7.4 创建一个新数组，加入没有加入过得元素

// function uniquel4(array) {
//     let result = [];
//     array.forEach(item => {
//         if (result.indexOf(item) === -1) {
//             result.push(item);
//         }
//     })
//     return result;
// }


// // 7.test
// let array = [1, 2, 3, 4, 4, 2, 3, 1];

// console.log(uniquel1(array));
// console.log(uniquel2(array));
// console.log(uniquel3(array));
// console.log(uniquel4(array));

// 8.数组扁平化

// function flat1(array) {
//     return array.reduce((preValue, curItem) => {
//         return preValue.concat(Array.isArray(curItem) ? flat1(curItem) : curItem);
//     }, [])
// }

// function flat2(array) {
//     let res = [];
//     array.forEach(item => {
//         if (Array.isArray(item)) {
//             res = res.concat(flat2(item))
//         } else {
//             res.push(item);
//         }
//     });
//     return res;
// }

// function flat3(array) {
//     while (array.some(item => Array.isArray(item))) {
//         array = [].concat(...array)
//     }
//     return array;
// }

// function flat4(array) {
//     return array.toString().split(',').map(item => parseInt(item));
// }

// function flat5(array) {
//     return array.join(',').split(',').map(item => Number(item));
// }

// // 8.test

// let arr = [1, 2, 3, 4, [5, 6, 7], [8, 9, [10, 11]]]

// console.time('flat1');
// console.log(flat1(arr));
// console.timeEnd('flat1');
// console.log('----------------------');
// console.time('flat2');
// console.log(flat2(arr));
// console.timeEnd('flat2');
// console.log('----------------------');
// console.time('flat3');
// console.log(flat3(arr));
// console.timeEnd('flat3');
// console.log('----------------------');
// console.time('flat4');
// console.log(flat4(arr));
// console.timeEnd('flat4');
// console.log('----------------------');
// console.time('flat5');
// console.log(flat5(arr));
// console.timeEnd('flat5');

// Promise

// const myPromise = function (exector) {
//     this.PromiseState = "pending";
//     this.PromiseResult = null;
//     this.resolveCallback = [];
//     this.rejectCallback = [];

//     const that = this;
//     function resolve(data) {
//         setTimeout(() => {
//             if (that.PromiseState === "pending") {
//                 that.PromiseState = "fulfilled";
//                 that.PromiseResult = data;
//                 that.resolveCallback.forEach(callback => {
//                     callback(data);
//                 })
//             }
//         });
//     }
//     function reject(data) {
//         setTimeout(() => {
//             if (that.PromiseState === "pending") {
//                 that.PromiseState = "rejected";
//                 that.PromiseResult = data;
//                 that.rejectCallback.forEach(callback => {
//                     callback(data);
//                 })
//             }
//         });
//     }

//     try {
//         exector(resolve, reject);
//     } catch (error) {
//         reject(error.message);
//     }
// }

// myPromise.prototype.then = function (onResolve, onReject) {
//     onResolve = typeof onResolve === 'function' ? onResolve : () => { }
//     onReject = typeof onReject === 'function' ? onReject : () => { }
//     return new myPromise((resolve, reject) => {
//         try {
//             if (this.PromiseState === "fulfilled") {
//                 let result = onResolve(this.PromiseResult);
//                 if (result instanceof myPromise) {
//                     result.then(res => {
//                         resolve(res);
//                     }, reason => {
//                         reject(reason);
//                     })
//                 } else {
//                     resolve(result);
//                 }
//             }
//             if (this.PromiseState === "rejected") {
//                 let result = onReject(this.PromiseResult);
//                 if (result instanceof myPromise) {
//                     result.then(res => {
//                         resolve(res);
//                     }, reason => {
//                         reject(reason);
//                     })
//                 } else {
//                     reject(result);
//                 }
//             }
//             if (this.PromiseState === "pending") {
//                 this.resolveCallback.push((data) => {
//                     try {
//                         let result = onResolve(data);
//                         if (result instanceof myPromise) {
//                             result.then(res => {
//                                 resolve(result);
//                             }, reason => {
//                                 reject(reason);
//                             })
//                         } else {
//                             resolve(result);
//                         }
//                     } catch (error) {
//                         reject(error)
//                     }
//                 })
//                 this.rejectCallback.push((data) => {
//                     try {
//                         let result = onReject(data);
//                         if (result instanceof myPromise) {
//                             result.then(res => {
//                                 resolve(result);
//                             }, reason => {
//                                 reject(reason);
//                             })
//                         } else {
//                             reject(result);
//                         }
//                     } catch (error) {
//                         reject(error)
//                     }
//                 })
//             }
//         } catch (error) {
//             reject(error)
//         }
//     })
// }

// myPromise.all = function (promises) {
//     return new myPromise((resolve, reject) => {
//         if (!Array.isArray(promises)) {
//             throw new Error(`TypeError: Expect an array of promises, got ${promises}`)
//         }

//         let result = [];
//         let count = 0;
//         if (promises.length === 0) {
//             resolve(result)
//         }
//         for (let promise of promises) {
//             promise.then(res => {
//                 result[count++] = res;
//                 if (count === promises.length) {
//                     resolve(result);
//                 }
//             }, reason => {
//                 reject(reason);
//             })
//         }
//     })
// }

// myPromise.allSettled = function (promises) {
//     return new myPromise((resolve, reject) => {
//         if (!Array.isArray(promises)) {
//             throw new Error(`TypeError: Expect an array of promises, got ${promises}`)
//         }

//         let result = [];
//         let count = 0;
//         if (promises.length === 0) {
//             resolve(result)
//         }
//         for (let promise of promises) {
//             promise.then(res => {
//                 result[count++] = {
//                     state: "fulfilled",
//                     value: res
//                 };
//                 if (count === promises.length) {
//                     resolve(result);
//                 }
//             }, reason => {
//                 result[count++] = {
//                     state: "rejected",
//                     value: reason
//                 };
//                 if (count === promises.length) {
//                     resolve(result);
//                 }
//             })
//         }
//     })
// }


// myPromise.race = function (promises) {
//     return new myPromise((resolve, reject) => {
//         if (!Array.isArray(promises)) {
//             throw new Error(`TypeError: Expect an array of promises, got ${promises}`)
//         }
//         if (promises.length === 0) {
//             resolve([])
//         }
//         for (let promise of promises) {
//             promise.then(res => {
//                 resolve(res);
//             }, reason => {
//                 reject(reason);
//             })
//         }
//     })
// }

// myPromise.prototype.catch = function (onReject) {
//     return this.then(undefined, onReject);
// }

// const promise1 = new myPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('1st')
//     }, 100);
// })

// const promise2 = new myPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('2nd')
//     }, 200);
// })

// const promise3 = new myPromise((resolve, reject) => {
//     setTimeout(() => {
//         reject("3rd")
//     }, 300);
// })

// const promise4 = new myPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("4th")
//     }, 400);
// })

// ----------------------------------------------------------------

// promise3.then(res => {
//     console.log(res);
// }).catch(reason => {
//     console.log(reason);
// })
// const promises = [promise1, promise2, promise3, promise4];

// myPromise.all(promises).then(res => {
//     console.log(res);
// }, reason => {
//     console.log(reason);
// })

// myPromise.allSettled(promises).then(res => {
//     console.log(res);
// }, reason => {
//     console.log(reason);
// })

// myPromise.race(promises).then(res => {
//     console.log(res);
// }, reason => {
//     console.log(reason);
// })

// 10.手写Object.create()

// function myCreate(proto, properties) {
//     if (typeof proto !== "object" || proto == null) {
//         throw new Error("Object prototype mayonly be an Object or null")
//     }

//     function Fn() { }
//     Fn.prototype = proto;

//     const obj = new Fn();

//     if (properties !== undefined) {
//         if (typeof properties !== "object" || properties == null) {
//             throw new Error("Object prototype mayonly be an Object or null")
//         }

//         Object.defineProperties(obj, properties);
//     }
//     return obj;
// }



// 11.快排

// const quickSort = array => {
//     _quickSort(array);

//     return array;
// }

// const _quickSort = function (array, start, end) {
//     if (end - start < 1) return;

//     const base = array[start];
//     let left = start;
//     let right = end;
//     while (left < right) {
//         while (left < right && array[right] >= base) right--;
//         array[left] = array[right];

//         while (left < right && array[left] <= base) left++;
//         array[right] = array[left];
//     }

//     array[left] = base;
//     _quickSort(array, start, left - 1);
//     _quickSort(array, left + 1, end);
//     return array;
// }

// 12.手写JSONP

// function addScript(src) {
//     const script = document.createElement("script");
//     script.src = src;
//     script.type = "text/javascript";
//     document.body.appendChild(script);
// }
// addScript("http://xxxx.xxx.com/xx.js?callback=handleRes")

// let handleRes = function () {

// }

// 13.手写寄生组合继承

// function Parent(name) {
//     this.name = name
//     this.say = function () {
//         console.log(this.name);
//     }
// }

// Parent.prototype.play = function () {
//     console.log(222);
// }

// function Children(name, age) {
//     Parent.call(this, name)
//     this.age = age;
// }

// Children.prototype = Object.create(Parent.prototype);

// Children.prototype.constructor = Children;

// 14. 手写二分查找

// function search(nums, target) {
//     if (nums.length === 0) return -1;
//     let left = 0;
//     let right = nums.length - 1;
//     while (left <= right) {
//         let mid = Math.floor((left + right) / 2);
//         if (nums[mid] < target) left = mid + 1;
//         else if (nums[mid] > target) right = mid - 1;
//         else return mid;
//     }
//     return -1;
// }

// const promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success')
//     }, 1000)
// })
// const promise2 = promise1.then(() => {
//     throw new Error('error!!!')
// })
// console.log('promise1', promise1)
// console.log('promise2', promise2)
// setTimeout(() => {
//     console.log('promise1', promise1)
//     console.log('promise2', promise2)
// }, 2000)

// 手写发布订阅

// class EventBus {
//     constructor() {
//         this.events = {};
//     }
//     subscribe(event, callback) {
//         if (!this.events[event]) {
//             this.events[event] = [];
//         }
//         this.events[event].push(callback);
//     }

//     unsubscribe(event, callback) {
//         if (!this.events[event]) return;
//         this.events[event] = this.events[event].filter(cb => cb !== callback);
//     }

//     publish(event, data) {
//         if (!this.events[event]) return;
//         this.events[event].forEach(callback => {
//             callback(data)
//         });
//     }
// }


// // 创建一个事件管理器实例
// const eventBus = new EventBus();

// // 订阅事件
// const callback1 = data => {
//     console.log('Callback 1:', data);
// };
// eventBus.subscribe('event1', callback1);

// const callback2 = data => {
//     console.log('Callback 2:', data);
// };
// eventBus.subscribe('event2', callback2);

// // 发布事件
// eventBus.publish('event1', 'Hello from event1');
// eventBus.publish('event2', 'Hello from event2');

// // 取消订阅事件
// eventBus.unsubscribe('event1', callback1);

// // 再次发布事件，callback1 不会被触发
// eventBus.publish('event1', 'Hello again from event1');



// css 水平垂直居中

// 定位加margin auto
// 定位加margin 负值
// 定位加transform
// flex
// grid

// css 画三角

// width，height设为0， 利用border 和 transparent

// css 两栏和三栏布局

// float + margin
// flex:1
// grid

// bfc

// body    float    position(absolute, fixed)    display:flex  inline-block  table-cell  table-caption      overflow: hidden auto scroll

// 特点：
// 1. 垂直方向 文档流 从上向下排列
// 2. bfc中的上下相邻元素margin重叠
// 3. bfc计算高度时会计算浮动元素高度
// 4. bfc区域不与浮动元素重叠
// 5. bfc内部元素不与外部元素发生重叠
// 6.

// function pormisify(fn) {
//     return function (...args) {
//         return new Promise((resolve, reject) => {
//             fn(...args, (err, result) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             })
//         })
//     }
// }

// const quickSort = function (array) {
//     if (Array.length === 0 || array.length === 1) return array;
//     let base = array[start];

//     while (left < right) {
//         while (left < right && array[right] >= base) right--;
//         array[left] = array[right];
//         while (left < right && array[left] <= base) left++;
//         array[right] = array[left];

//     }

// }

// promise 并发控制

// const promiseControlor = function (promises, limit) {
//     let result = [];
//     let running = 0;
//     let index = 0;

//     return new Promise((resolve, reject) => {
//         function next() {
//             if (index >= promises.length) {
//                 resolve(result);
//                 return;
//             }

//             const currentPromise = promises[index];
//             index++;

//             currentPromise.then(res => {
//                 result.push(res);
//             }).catch(err => {
//                 reject(err);
//             }).finally(() => {
//                 running--;
//                 next();
//             })

//         }

//         while (running < limit && index < promises.length) {
//             running++;
//             next();
//         }
//     })
// }
// const promsie1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(1);
//     }, 100);
// })
// const promsie2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(2);
//     }, 200);
// })

// const promsie3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(3);
//     }, 300);
// })

// const promsie4 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(4);
//     }, 400);
// })

// const promsie5 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(5);
//     }, 500);
// })

// promiseControlor([promsie1, promsie2, promsie3, promsie4, promsie5], 1).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });

// let urls = ['bytedance.com', 'tencent.com', 'alibaba.com', 'microsoft.com', 'apple.com', 'hulu.com', 'amazon.com'] // 请求地址
// let request = url => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(`任务${url}完成`)
//         }, 1000)
//     }).then(res => {
//         console.log('外部逻辑', res);
//     })
// }

// async function promiseControl(urls, limit, callback) {
//     let pool = new Set(); // 并发池
//     for (let i in urls) {
//         let url = urls[i];
//         let task = request(url);
//         task.then(res => {
//             pool.delete(task);
//             console.log(`${url}结束，当前并发数${pool.size}`);
//         })
//         pool.add(task);
//         if (pool.size >= limit) {
//             await Promise.race([...pool])
//         }
//     }

// }

// promiseControl(urls, 4)

// const length = 10;
// function fn() {
//     console.log(this);
//     console.log(this.length);
// }

// const obj = {
//     length: 5,
//     test: function () {
//         fn();
//     }
// }
// console.log(obj.test());




// let urls = ['bytedance.com', 'tencent.com', 'alibaba.com', 'microsoft.com', 'apple.com', 'hulu.com', 'amazon.com'] // 请求地址

// const request = function (url) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(`${url}执行完成`)
//         }, 1000)
//     }).then(res => {
//         console.log("外部逻辑", res);
//         return Promise.resolve(res);
//     })
// }

// const promiseControl = async function (urls, limit, callback) {
//     let pool = new Set(); // 并发池
//     let result = [];
//     for (let url of urls) {
//         let task = request(url);
//         task.then(res => {
//             pool.delete(task);
//             result.push({
//                 url,
//                 status: "fulfilled",
//                 value: res
//             });
//         }).catch(err => {
//             pool.delete(task);
//             result.push({
//                 url,
//                 status: "rejected",
//                 value: err
//             })
//         })
//         pool.add(task);
//         if (pool.size >= limit) {
//             await Promise.race([...pool])
//         }
//     }
//     await Promise.allSettled([...pool]);
//     callback(result);
// }


// promiseControl(urls, 3, (res) => {
//     console.log('全部执行完成', res);
// })


// bubbleSort 

const bubbleSort = (arr) => {
    const len = arr.length;
    let flag = false;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                flag = true;
            }
        }
        if (!flag) {
            break;
        }
    }
}
let arr = [3, 6, 7, 1, 3, 4, 7, 9, 1];


console.log(arr);

// insertSort 

const insertSort = (arr) => {
    const len = arr.length;
    let cur, pre;
    for (let i = 1; i < len; i++) {
        cur = arr[i];
        pre = i - 1;
        while (arr[pre] > cur) {
            arr[pre + 1] = arr[pre];
            pre--;
        }
        arr[pre + 1] = cur;
    }
}

// selectSort
const selectSort = (arr) => {
    const len = arr.length;
    let temp, minIndex;
    for (let i = 0; i < len; i++) {
        minIndex = i;
        for (let j = i; j < len; j++) {
            if (arr[j] <= arr[minIndex]) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}

const mergeSort = (arr) => {
    const merge = (left, right) => {
        let result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j])
                j++;
            }
        }
        while (i < left.length) {
            result.push(left[i])
            i++;
        }
        while (j < right.length) {
            result.push(right[j])
            j++;
        }
        return result;
    }
    const sort = (arr) => {
        if (arr.length === 1) return arr;
        let mid = Math.floor(arr.length / 2);
        let left = arr.slice(0, mid);
        let right = arr.slice(mid, arr.length);
        return merge(mergeSort(left), mergeSort(right));
    }
    return sort(arr);
}

const quickSort = (arr) => {
    const quick = (arrs) => {
        if (arrs.length <= 1) return arrs;
        const len = arrs.length;
        const left = [];
        const right = [];
        const index = Math.floor(Math.random() * len);
        const base = arrs.splice(index, 1)[0];
        for (let i = 0; i < len - 1; i++) {
            if (arrs[i] < base) {
                left.push(arrs[i])
            } else {
                right.push(arrs[i])
            }
        }
        return quick(left).concat([base], quick(right));
    }
    return quick(arr);
}


console.log(quickSort(arr));
