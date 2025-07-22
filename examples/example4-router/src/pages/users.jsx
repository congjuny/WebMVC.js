//
import { WebMVCComponent } from "web-mvc-js";

export class UsersPage extends WebMVCComponent {
  render() {
    const users = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ];

    return (
      <div>
        <h1>Users</h1>
        <nav>
          <a href="/">← Home</a>
        </nav>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <a href={`/user/${user.id}`}>{user.name}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
