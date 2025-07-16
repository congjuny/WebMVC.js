import { ProxyBaseModel } from "../framework/proxy-base-model";

export class CounterProxyModel extends ProxyBaseModel {
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
