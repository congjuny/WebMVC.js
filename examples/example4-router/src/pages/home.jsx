import { WebMVCComponent } from "web-mvc-js";

export class HomePage extends WebMVCComponent {
  constructor() {
    super();
  }

  render() {
    console.log("HomePage render() called");
    return (
      <div>
        <h1>Home Page</h1>
        <p>Welcome to our SPA!</p>
        <nav>
          <a href="/users">View Users</a> | <a href="/about">About</a>
        </nav>
      </div>
    );
  }
}
