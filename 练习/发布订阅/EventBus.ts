interface EventCallbacks {
  [index: string]: Function[];
}

class EventBus {
  events: EventCallbacks;
  constructor() {
    this.events = {};
  }
  $on(eventName: string, callback: Function) {
    if (this.events[eventName]) {
      this.events[eventName].push(callback);
    } else {
      this.events[eventName] = [];
    }
  }
  $off(eventName: string, callback: Function) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      (cb: Function) => cb !== callback
    );
  }
  $emit(eventName: string, ...args: any[]) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((cb: Function) => cb.apply(this, args));
  }
}
