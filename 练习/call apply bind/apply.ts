class myFunction {
  fn: Function;
  constructor(fn: Function) {
    this.fn = fn;
  }
  apply(context: any, args?: any[]) {
    const fn = this;
    context = context == null ? window : Object(context);
    const _fn = Symbol();
    context[_fn] = fn;
    const result = context[_fn](...args);
    delete context[_fn];
    return result;
  }
}

const fn = new myFunction(function () {
  console.log((this as any).name);
});

fn.apply({ name: "小明" });
