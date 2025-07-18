import { WebMVCComponent } from "web-mvc-js";

export class CounterInputField extends WebMVCComponent {
  constructor(props) {
    super(props.model);
    this.label = props.label;
    //this.model = props.model;
    this.handler = props.onInput;
    console.log("CounterInputField created", this);
  }

  render() {
    console.log("CounterInputField.render() with count =", this.model?.count);
    return (
      <div class="form-group">
        <label for="counter-input">{this.label}</label>
        <input
          type="number"
          id="counter-input"
          ref="counterInput"
          //value={this.model?.count}
          onInput={(e) => this.handler(Number(e.target.value))}
        ></input>
      </div>
    );
  }
}
