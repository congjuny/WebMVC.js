import { Component } from "@framework/component";
import { CounterDisplay } from "./CounterDisplay";
import { CounterButton } from "./CounterButton";
import { CounterProxyModel } from "./CounterProxyModel";

export class App extends Component {
  constructor() {
    const model = new CounterProxyModel();
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
