import { WebMVCComponent } from "web-mvc-js";

export class CounterDisplay extends WebMVCComponent {
  constructor({ model }) {
    super(model); // optional if your base class uses model
    this.model = model;
    console.log("CounterDisplay created", this);
  }

  render() {
    console.log("CounterDisplay.render() with count =", this.model?.count);
    return (
      <div class="counter-display" id="counter-display">
        <p>Count: {this.model?.count}</p>
      </div>
    );
  }
}
