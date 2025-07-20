import { WebMVCComponent } from "web-mvc-js";

export class CounterInputField extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.props = props || {};

    if (this.props.model?.addListener) {
      this.props.model.addListener((property, newValue, oldValue) => this.update(property, newValue, oldValue));
    }
    console.log("CounterInputField created", this);
  }

  update(property, newValue, oldValue) {
    console.log("CounterInputField.update() called, newValue =", newValue, "oldValue =", oldValue);
  }

  afterMount() {
    console.log(`${this.constructor.name}.afterMount this.refs:`, this.refs);
  }

  render() {
    console.log("CounterInputField.render() with count =", this.model?.count);
    return (
      <div class="form-group">
        <label for={this.props.id || "counter-input"}>{this.props.label}</label>
        <input
          type={this.props.type || "text"}
          id={this.props.id || "counter-input"}
          ref={this.props.refName}
          value={this.props.value || ""}
          onInput={(e) => this.props.onInput(e.target.value)}
        ></input>
      </div>
    );
  }
}
