# apply, call和bind

## apply

### apply 是什么，有什么用

apply：apply()方法接受两个参数，第一个参数是要绑定的上下文对象，第二个参数是一个数组或类数组对象，表示函数调用时的参数列表。它将函数绑定到指定的上下文对象，并传入参数列表进行调用。

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet.apply(null, ['Alice']); // Hello, Alice!
```

### 手写实现

```js
Function.prototype._apply = function (context, args) {
    const fn = this;
    context = context == null ? window : Object(context);
    const _fn = Symbol();
    context[_fn] = fn;
    const result = context[_fn](...args);
    delete context[_fn];
    return result;
}
```

## call

### call 是什么，有什么用

call：call()方法与apply()方法类似，也是接受两个参数，第一个参数是要绑定的上下文对象，后面的参数依次表示函数调用时的参数列表。它将函数绑定到指定的上下文对象，并传入参数列表进行调用。

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet.call(null, 'Bob'); // Hello, Bob!
```

### 手写实现

```js
Function.prototype._call = function(context, ...args) {
    const fn = this;
    context = context == null? window : Object(context);
    const _fn = Symbol();
    context[_fn] = fn;
    const result = context[_fn](...args);
    delete context[_fn];
    return result;
}
```

## bind

### bind 是什么，有什么用

bind：bind()方法返回一个新函数，新函数的this值被永久地绑定到指定的上下文对象。与apply()和call()不同，bind()方法不会立即执行函数，而是返回一个绑定了指定上下文的新函数。

```js
function greet() {
  console.log(`Hello, ${this.name}!`);
}

const obj = {
    name: 'Alice'
}

const greetAlice = greet.bind(obj);
greetAlice();  // Hello, Alice!
```

### 手写实现

```js
Function.prototype._bind = function (context) {
    const fn = this;
    return function (...args) {
        return fn.apply(context, args);
    }
}
```
