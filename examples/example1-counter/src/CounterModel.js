
import { Model } from '@framework/model';

export class CounterModel extends Model {
  count = 0;

  increment() {
    this.count++;
    console.log("Incremented to", this.count);
    this.notify();
  }

  decrement() {
    this.count--;
    console.log("Decremented to", this.count);
    this.notify();
  }
}
