//
import { WebMVCComponent } from "web-mvc-js";

export default class AboutPage extends WebMVCComponent {
  render() {
    return (
      <div class="page about-page">
        <h1>About Us</h1>
        <p>This page was loaded dynamically when you clicked the About link.</p>
        <p>Check the Network tab in DevTools to see the separate chunk being loaded!</p>
      </div>
    );
  }
}
