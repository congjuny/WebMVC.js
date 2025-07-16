import { WebMVCComponent } from "web-mvc-js";
import { CounterDisplay } from "./CounterDisplay";
import { CounterButton } from "./CounterButton";
import { CounterModel } from "./CounterModel";

export class App extends WebMVCComponent {
  constructor() {
    const model = new CounterModel();
    super({ model });
    this.model = model;
  }

  render() {
    console.log("App render() called");
    return (
      <div>
        <CounterDisplay model={this.model} />
        <div style="display: flex; gap: 1em;">
          <CounterButton
            label="Increment"
            onClick={() => this.model.increment()}
          />
          <CounterButton
            label="Decrement"
            onClick={() => this.model.decrement()}
          />
        </div>
      </div>
    );
  }
}
