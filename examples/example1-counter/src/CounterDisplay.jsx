import { Component } from '@framework/component';
import { CounterTitle } from './CounterTitle';

export class CounterDisplay extends Component {
  constructor({model}) {
    super(model); // optional if your base class uses model
    this.model = model;
    console.log("CounterDisplay created", this);
  }

  render() {
    console.log("CounterDisplay.render() with count =", this.model?.count);
    return (
      <div>
        <CounterTitle/>
        <h1>Counter Display</h1>
        <p>This component displays the current count value.</p>
        <h2>Count: {this.model?.count}</h2>
      </div>
    )
  }
}
