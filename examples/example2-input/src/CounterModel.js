import { WebMVCModel } from "web-mvc-js";

export class CounterModel extends WebMVCModel {
  count = 0;

  increment() {
    this.count++;
    console.log("CounterProxyModel Incremented to", this.count);
  }

  decrement() {
    this.count--;
    console.log("CounterProxyModel Decremented to", this.count);
  }

  setCount(newValue) {
    this.count = newValue;
    console.log("CounterProxyModel Set to", this.count);
  }

  reset() {
    this.count = 0;
    console.log("CounterProxyModel Reset to", this.count);
  }

  random() {
    this.count = Math.floor(Math.random() * 100);
    console.log("CounterProxyModel Randomized to", this.count);
  }
}
