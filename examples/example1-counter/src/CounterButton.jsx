import { Component } from '@framework/component';

export class CounterButton extends Component {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.handler = props.onClick;
  }

  render() {
    console.log("Rendering Button with label =", this.label);
    return <button onClick={this.handler}>{this.label}</button>;
  }
}
