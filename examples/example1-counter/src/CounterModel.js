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
}
