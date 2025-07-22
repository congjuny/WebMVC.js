import { WebMVCComponent } from "web-mvc-js";

export class UserPage extends WebMVCComponent {
  constructor(props) {
    super(props); // optional if your base class uses model
    this.id = props?.params.id;
  }

  render() {
    return (
      <div>
        <h1>User {this.id}</h1>
        <nav>
          <a href="/users">← Back to Users</a>
        </nav>
        <p>Details for user {this.id}</p>
      </div>
    );
  }
}
