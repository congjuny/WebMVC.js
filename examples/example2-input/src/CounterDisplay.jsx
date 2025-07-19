import { WebMVCComponent } from "web-mvc-js";

export class CounterDisplay extends WebMVCComponent {
  constructor(props) {
    super(props); // optional if your base class uses model
    this.model = props?.model;
    console.log("CounterDisplay created", this);

    if (this.model?.addListener) {
      this.model.addListener((property, newValue, oldValue) => this.update(property, newValue, oldValue));
    }
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
