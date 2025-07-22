import { WebMVCComponent } from "web-mvc-js";

export class AboutPage extends WebMVCComponent {
  render() {
    return (
      <div>
        <h1>About</h1>
        <nav>
          <a href="/">← Home</a>
        </nav>
        <p>This is a single page application!</p>
      </div>
    );
  }
}
