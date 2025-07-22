import { WebMVCComponent } from "web-mvc-js";

export class App extends WebMVCComponent {
  constructor() {
    super();
  }

  render() {
    console.log("App render() called");
    return (
      <div>
        <main id="router-outlet" ref="router-outlet" style="padding: 0 1rem;">
          {/* Router content goes here */}
        </main>
      </div>
    );
  }
}
