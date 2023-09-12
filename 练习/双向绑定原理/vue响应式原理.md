# vue响应式原理

## 数据响应式

![vue双向绑定](https://www.kecat.top/other/vue双向绑定.png)

> 数据响应式：数据驱动视图，数据改变 => 视图更新

Vue采用的是数据劫持结合发布和-订阅者模式的方式，通过拦截对数据的操作，在数据变动时发 布消息给订阅者，触发相应的监听回调。

## 数据劫持原理

### vue2.x `Object.defineProperty()`

vue2通过`Object.defineProperty`对`data`上的数据递归地进行`getter`和`setter`操作，在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。也就是对属性的读取、修改进行拦截（数据劫持）但是监听不到数组元素的改变，以及新属性的添加，旧元素的删除

### vue3.x Proxy

vue3通过`Proxy`对象创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。`Proxy`的监听是深层次的，监听整个对象，而不是某个属性。可以监听到数组的变化以及新属性的添加及旧元素的删除。

### 使用Object.defineProperty()实现

```js
class myVue {
  constructor(options) {
    this.$el = options.data;
    this.$data = options.data;
    this.$options = options;
    this.observer();
  }
  observer() {
    let value = this.$data;
    const that = this;
    for (let key in this.$data) {
      Object.defineProperty(this.$data, key, {
        get: () => {
          return value[key];
        },
        set: (val) => {
          console.log("修改");
          this.$data[key] = val;
          // watcher 更新视图
        }
      })
    }
  }
}
```

### 使用Proxy实现

先来了解下 Proxy 的两个参数
`new Proxy(target,handler)`

- target ：要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
- handler：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为

其实 和 Vue2.X实现的逻辑差不多，不过实现的方法不一样
那么就放上代码了

```js
<body>
    <div id="app"></div>
    <script>
            // 模拟 Vue data
            let data = {
                msg: '',
                age: '',
            }
            // 模拟 Vue 的一个实例
            // Proxy 第一个
            let vm = new Proxy(data, {
                // get() 获取值
                // target 表示需要代理的对象这里指的就是 data
                // key 就是对象的 键
                get(target, key) {
                    return target[key]
                },
                // 设置值
                // newValue 是设置的值
                set(target, key, newValue) {
                    // 也先判断下是否和之前的值一样 节省性能
                    if (target[key] === newValue) return
                    // 进行设置值
                    target[key] = newValue
                    document.querySelector('#app').textContent = target[key]
                },
            })
    </script>
</body>
```

## 发布者-订阅者模式

简单地说，发布者-订阅者模式的流程就是，**监听器**监听数据状态变化, 一旦**数据发生变化**，则会通知对应的订阅者，让**订阅者执行对应的业务逻辑**。
我们熟知的事件机制，就是一种典型的发布-订阅的模式。
首先要对数据进行劫持监听，所以我们需要设置一个**监听器Observer**，用来监听所有属性。如果属性发生变化了，就需要告诉**订阅者Watcher**看是否需要更新。因为订阅者是有很多个，所以我们需要有一个**消息订阅器Dep**来专门收集这些订阅者，然后在监听器Observer和订阅者Watcher之间进行统一管理。接着，我们还需要有一个**指令解析器Compile**，对每个节点元素进行**扫描和解析**，将相关指令对应初始化成一个订阅者Watcher，并替换模板数据或者绑定相应的函数，此时当订阅者Watcher接收到相应属性的变化，就会执行对应的更新函数，从而更新视图

关键步骤也就是：

1. Observer监听器劫持监听所有属性(监听到属性变化时，通知订阅者也就是消息订阅器Dep中的订阅者Watcher实例)
2. Compile指令解析器，遍历根节点元素及其子元素（元素结点nodeType === 1），进行扫描与解析，将相关指令解析为wathcer实例存入订阅收集器Dep中或者对相关事件绑定相应的函数，并扫描文本结点中的模板数据（nodeType === 3）然后正则匹配到 `{{ }}`替换为响应式数据，下面是Compile简单的模拟实现
3. Watcher订阅者中定义update函数用来更新页面视图，接收到通知消息后执行更新。

   ```js
   compile(node) {
        node.childNodes.forEach(item => {
            if (item.nodeType === 1) {

                // 判断click
                if (item.hasAttribute('@click')) {
                    let vmKey = item.getAttribute('@click').trim();
                    item.addEventListener('click', (event) => {
                        this.$eventFn = this.$options.methods[vmKey].bind(this);
                        this.$eventFn(event);
                    });
                }

                // 判断v-model
                if (item.hasAttribute('v-model')) {

                    let vmKey = item.getAttribute('v-model').trim();
                    item.value = this.$data[vmKey];
                    item.addEventListener('input', (event) => {
                        this[vmKey] = item.value;
                    });
                }

                this.compile(item)
            }
            if (item.nodeType === 3) {
                let reg = /\{\{ (.*?) \}\}/g;
                let text = item.textContent;
                item.textContent = text.replace(reg, (match, vmKey) => {
                    vmKey = vmKey.trim();

                    if (this.hasOwnProperty(vmKey)) {
                        let watcher = new Watch(this, vmKey, item, 'textContent');
                        if (this.$watchEvent[vmKey]) {
                            this.$watchEvent[vmKey].push(watcher);
                        } else {
                            this.$watchEvent[vmKey] = [];
                            this.$watchEvent[vmKey].push(watcher);
                        }
                        console.log(this.$watchEvent);
                    }

                    return this.$data[vmKey];
                });
            }
        });
    }
   ```

- 监听器Observer ，用来监听数据源变化.
- 消息订阅器Dep，由于监听器和订阅者是一对多的关系,所以这里设计了一个管理中心,来管理某个监听器及其对应的订阅者的关系, 消息调度和依赖管理都靠它。
- 订阅者Watcher，当某个监听器监听到数据发生变化的时候，这个变化经过消息调度中心，最终会传递到所有该监听器对应的订阅者身上，然后这些订阅者分别执行自身的业务回调即可

## Watcher，Observer，Dep相关简单的模拟实现

### observer.js

在这里把 data 中的 属性变为响应式加在自身的身上，还有一个主要功能就是 观察者模式在 第 4.dep.js 会有详细的使用

```js
/* observer.js */

class Observer {
  constructor(data) {
    // 用来遍历 data
    this.walk(data)
  }
  // 遍历 data 转为响应式
  walk(data) {
    // 判断 data是否为空 和 对象
    if (!data || typeof data !== 'object') return
    // 遍历 data
    Object.keys(data).forEach((key) => {
      // 转为响应式
      this.defineReactive(data, key, data[key])
    })
  }
  // 转为响应式
  // 要注意的 和vue.js 写的不同的是
  // vue.js中是将 属性给了 Vue 转为 getter setter
  // 这里是 将data中的属性转为getter setter
  defineReactive(obj, key, value) {
    // 如果是对象类型的 也调用walk 变成响应式，不是对象类型的直接在walk会被return
    this.walk(value)
    // 保存一下 this
    const self = this
    Object.defineProperty(obj, key, {
      // 设置可枚举
      enumerable: true,
      // 设置可配置
      configurable: true,
      // 获取值
      get() {
        return value
      },
      // 设置值
      set(newValue) {
        // 判断旧值和新值是否相等
        if (newValue === value) return
        // 设置新值
        value = newValue
        // 赋值的话如果是newValue是对象，对象里面的属性也应该设置为响应式的
        self.walk(newValue)
      },
    })
  }
}


```

### dep.js

写一个Dep类 它相当于 观察者中的发布者  每个响应式属性都会创建这么一个 Dep 对象 ，负责收集该依赖属性的Watcher对象 （是在使用响应式数据的时候做的操作）
当我们对响应式属性在 setter 中进行更新的时候，会调用 Dep 中 notify 方法发送更新通知
然后去调用 Watcher 中的 update 实现视图的更新操作（是当数据发生变化的时候去通知观察者调用观察者的update更新视图）
总的来说 在Dep(这里指发布者) 中负责收集依赖 添加观察者(这里指Wathcer)，然后在 setter 数据更新的时候通知观察者
说的这么多重复的话，大家应该知道是在哪个阶段 收集依赖 哪个阶段 通知观察者了吧，下面就来实现一下吧

```js
/* dep.js */

class Dep {
  constructor() {
    // 存储观察者
    this.subs = []
  }
  // 添加观察者
  addSub(sub) {
    // 判断观察者是否存在 和 是否拥有update方法
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 通知方法
  notify() {
    // 触发每个观察者的更新方法
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

// 然后在oberser监听到变化时dep.notify()
```

### Watcher

**watcher**的作用 数据更新后 收到通知之后 调用 update 进行更新

```js
/* watcher.js */

class Watcher {
  constructor(vm, key, cb) {
    // vm 是 Vue 实例
    this.vm = vm
    // key 是 data 中的属性
    this.key = key
    // cb 回调函数 更新视图的具体方法
    this.cb = cb
    // 把观察者的存放在 Dep.target
    Dep.target = this
    // 旧数据 更新视图的时候要进行比较
    // 还有一点就是 vm[key] 这个时候就触发了 get 方法
    // 之前在 get 把 观察者 通过dep.addSub(Dep.target) 添加到了 dep.subs中
    this.oldValue = vm[key]
    // Dep.target 就不用存在了 因为上面的操作已经存好了
    Dep.target = null
  }
  // 观察者中的必备方法 用来更新视图
  update() {
    // 获取新值
    let newValue = this.vm[this.key]
    // 比较旧值和新值
    if (newValue === this.oldValue) return
    // 调用具体的更新方法
    this.cb(newValue)
  }
}


```

那么去哪里创建 `Watcher` 呢？还记得在 compiler.js中 对文本节点的编译操作吗

在编译完文本节点后 在这里添加一个`Watcher`

还有 `v-text` `v-model` 指令 当编译的是元素节点 就添加一个 Watcher

```js
/* compiler.js */

class Compiler {
  // vm 指 Vue 实例
  constructor(vm) {
    // 拿到 vm
    this.vm = vm
    // 拿到 el
    this.el = vm.$el
    // 编译模板
    this.compile(this.el)
  }
  // 编译模板
  compile(el) {
    let childNodes = [...el.childNodes]
    childNodes.forEach((node) => {
      if (this.isTextNode(node)) {
        // 编译文本节点
        this.compileText(node)
      } 
       ...
  }
  // 编译文本节点(简单的实现)
  compileText(node) {
    let reg = /\{\{(.+)\}\}/
    let val = node.textContent
    if (reg.test(val)) {
      let key = RegExp.$1.trim()
      node.textContent = val.replace(reg, this.vm[key])
      // 创建观察者
      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue
      })
    }
  }
  ...
  // v-text 
  textUpdater(node, key, value) {
    node.textContent = value
     // 创建观察者2
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // v-model
  modelUpdater(node, key, value) {
    node.value = value
    // 创建观察者
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    // 这里实现双向绑定 监听input 事件修改 data中的属性
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
}


```

当 我们改变 响应式属性的时候 触发了 set() 方法 ，然后里面 发布者 dep.notify 方法启动了，拿到了 所有的 观察者 watcher 实例去执行 update 方法调用了回调函数 cb(newValue) 方法并把 新值传递到了 cb() 当中 cb方法是的具体更新视图的方法 去更新视图
