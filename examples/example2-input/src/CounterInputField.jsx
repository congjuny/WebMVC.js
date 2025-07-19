import { WebMVCComponent } from "web-mvc-js";

export class CounterInputField extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.model = props.model;
    this.refName = props.refName || "counterInput"; // Define a ref name for the input
    this.handler = props.onInput;

    if (this.model?.addListener) {
      this.model.addListener((property, newValue, oldValue) => this.update(property, newValue, oldValue));
    }
    console.log("CounterInputField created", this);
  }

  update(property, newValue, oldValue) {
    console.log("CounterInputField.update() called, newValue =", newValue, "oldValue =", oldValue);
    //const input = this.getRef("counterInput");
    const input = this.refs.counterInput; // Use refs to access the input element

    if (input) {
      input.value = newValue; // Update input value directly
    }
  }

  afterMount() {
    console.log(`this.refs.counterInput:`, this.refs.counterInput);
  }

  render() {
    console.log("CounterInputField.render() with count =", this.model?.count);
    return (
      <div class="form-group">
        <label for="counter-input">{this.label}</label>
        <input
          type="number"
          id="counter-input"
          ref={this.refName}
          value={this.model?.count}
          onInput={(e) => this.handler(Number(e.target.value))}
        ></input>
      </div>
    );
  }
}
