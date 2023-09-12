class Vue {
    constructor(options) {
        this.$el = document.querySelector(options.el);
        this.$data = options.data;
        this.$options = options;
        this.$watchEvent = {};
        this.proxtData();
        this.observe();
        this.compile(this.$el);
    }

    // 劫持data中的属性
    proxtData() {
        for (let key in this.$data) {
            Object.defineProperty(this, key, {
                get() {
                    return this.$data[key];
                },
                set(val) {
                    console.log("修改");
                    this.$data[key] = val;
                }
            })
        }
    }

    // 劫持数据变化，进行视图更新
    observe() {
        for (let key in this.$data) {
            let value = this.$data[key];
            let that = this;
            Object.defineProperty(this.$data, key, {
                get() {
                    return value;
                },
                set(val) {
                    value = val;
                    if (that.$watchEvent[key]) {
                        that.$watchEvent[key].forEach(item => {
                            item.update();
                        })
                    }
                }
            })
        }
    }

    // 编译解析
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
}


// 更新视图

class Watch {
    constructor(vm, key, node, attr) {
        this.vm = vm;
        this.key = key;
        this.node = node;
        this.attr = attr;
    }
    // 数据发生改变 来更新视图
    update() {
        console.log(1111);
        this.node[this.attr] = this.vm[this.key];
    }


}

