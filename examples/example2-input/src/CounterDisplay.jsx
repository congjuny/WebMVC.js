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

  update(property, newValue, oldValue) {
    console.log("CounterDisplay.update() called, newValue =", newValue, "oldValue =", oldValue);

    // either directly update the element or call base update to re-create the DOM
    // this.refs.counterDisplay.textContent = `Count: ${this.model?.count || 0}`;
    super.update(property, newValue, oldValue);

    // You can add any specific update logic here if needed
    if (newValue > 50) {
      this.refs.counterDisplay.style.color = "red";
    } else {
      this.refs.counterDisplay.style.color = "#007bff";
    }
  }

  render() {
    console.log("CounterDisplay.render() with count =", this.model?.count);
    return (
      <div class="counter-display" id="counter-display">
        <p ref="counterDisplay">Count: {this.model?.count}</p>
      </div>
    );
  }
}
