import { WebMVCModel } from "web-mvc-js";

export class CounterModel extends WebMVCModel {
  constructor(data = {}) {
    super({
      count: 0,
      name: "",
      email: "",
      isActive: true,
      ...data,
    });
  }

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

  setName(newName) {
    this.name = newName;
  }

  setEmail(newEmail) {
    this.email = newEmail;
  }

  setActive(isActive) {
    this.isActive = isActive;
  }

  setAge(age) {
    this.age = age;
  }

  validate() {
    const isValid = this.name.length > 0 && this.email.includes("@");
    return isValid;
  }
}
