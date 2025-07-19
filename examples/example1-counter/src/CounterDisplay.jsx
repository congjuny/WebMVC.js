import { WebMVCComponent } from "web-mvc-js";
import { CounterTitle } from "./CounterTitle";

export class CounterDisplay extends WebMVCComponent {
  constructor(props) {
    super(props); // optional if your base class uses model
    this.model = props.model;

    if (this.model?.addListener) {
      this.model.addListener((property, newValue, oldValue) => this.update(property, newValue, oldValue));
    }
    console.log("CounterDisplay created", this);
  }

  render() {
    console.log("CounterDisplay.render() with count =", this.model?.count);
    return (
      <div>
        <CounterTitle />
        <p>A 'Hello, World!' app with the WebMVC.js framework</p>
        <h2>Count: {this.model?.count}</h2>
      </div>
    );
  }
}
