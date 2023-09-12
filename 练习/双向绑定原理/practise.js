class myVue {
  constructor(options) {
    this.$el = options.data;
    this.$data = options.data;
    this.$options = options;

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
        }
      })
    }
  }
}
