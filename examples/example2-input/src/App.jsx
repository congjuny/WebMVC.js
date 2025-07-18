import { WebMVCComponent } from "web-mvc-js";
import { CounterDisplay } from "./CounterDisplay";
import { CounterButton } from "./CounterButton";
import { CounterModel } from "./CounterModel";
import { CounterInputField } from "./CounterInputField";

export class App extends WebMVCComponent {
  constructor() {
    const model = new CounterModel();
    super({ model });
    this.model = model;
  }

  render() {
    console.log("App render() called");
    return (
      <div class="container">
        <h1>Example 2 - Input fields</h1>
        <div class="demo-section">
          <h2>Counter Section</h2>
          <CounterDisplay model={this.model} />
          <CounterInputField label="Count Input Value:" onInput={(newValue) => this.model.setCount(newValue)} />
          <CounterButton label="Increment" onClick={() => this.model.increment()} />
          <CounterButton label="Decrement" onClick={() => this.model.decrement()} />
          <CounterButton label="Reset" onClick={() => this.model.reset()} />
          <CounterButton label="Random" onClick={() => this.model.random()} />
        </div>
      </div>
    );
  }
}
