import { WebMVCComponent } from "web-mvc-js";

export class CounterTitle extends WebMVCComponent {
  constructor() {
    super();
    console.log("CounterTitle created", this);
  }

  render() {
    console.log("CounterTitle.render()");
    return (
      <div>
        <h1 style="text-align: center;">Counter Title</h1>
      </div>
    );
  }
}
