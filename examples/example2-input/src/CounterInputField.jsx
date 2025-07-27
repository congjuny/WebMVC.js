import { WebMVCComponent } from "web-mvc-js";

export class CounterInputField extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.props = props || {};

    if (this.props.model?.addListener) {
      this.props.model.addListener((changes, model) => this.update(changes, model));
    }
    console.log("CounterInputField created", this);
  }

  update(changes, model) {
    console.log("CounterInputField.update() called, changes =", changes);
    changes.forEach((change) => {
      const { path, newValue, oldValue } = change;
      console.log(`CounterInputField.update() - ${path}: "${oldValue}" → "${newValue}"`);
      if (this.props.refName === path) {
        this.refs[this.props.refName].value = newValue;
      }
    });
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
