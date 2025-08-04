import { WebMVCComponent } from "web-mvc-js";

export class CounterButton extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.handler = props.onClick;
  }

  render() {
    console.log("Rendering Button with label =", this.label);
    return (
      <button onClick={this.handler} style={{ color: this.label === "Decrement" ? "red" : "blue" }}>
        {this.label}
      </button>
    );
  }
}
